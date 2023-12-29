import mc from "minecraftstatuspinger";
import
{
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Interaction,
  InteractionReplyOptions,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder
} from 'discord.js';
import colors from "../../util/colors.js";
import CoordinateStore from "../Infrastructure/CoordinateStore.js";
import Coordinate from "../Infrastructure/Coordinate.js";
import { ServerStatus } from "minecraftstatuspinger/dist/types.js";
import { CommandType, ApplicationCommand } from "../Infrastructure/ApplicationCommand.js";
import ServiceClient from "../../ServiceClient.js";
import IDs from "../../ids_manager.js";

const MCServerIP = "cozycosmos.serveminecraft.net";
const MCServerPort = 25565;

enum MCStatusArgs
{
  ServerCommand = 'server_info',
  CoordinatesCommand = 'coordinates',
  AddCoordinateCommand = 'record_coorindate',
  EditCoordinateCommand = 'modify_coordinate',
  CoordinateDescription = 'coordinate_name',
  CoordinateX = 'coordinate_x',
  CoordinateY = 'coordinate_y',
  CoordinateZ = 'coordinate_z',
  CoordinateDimension = 'coordinate_dimension',
  RulesButtonID = 'rules_button',
  CoordinatesNextPageButtonID = 'coordinates_next',
  CoordinatesPrevPageButtonID = 'coordinates_prev',
}

async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction): Promise<void>
{
  switch (interaction.options.getSubcommand())
  {
    case MCStatusArgs.ServerCommand:
      return SendServerInfo(interaction);
    case MCStatusArgs.CoordinatesCommand:
      return SendCoordinatesMessage(client, interaction);
    case MCStatusArgs.AddCoordinateCommand:
      return AddCoordinate(client, interaction);
    case MCStatusArgs.EditCoordinateCommand:
      return EditCoordinate(client, interaction);
    default:
      interaction.reply({ content: "Oops, your request could not be processed...", ephemeral: true });
      return;
  }
};

async function ClearCoordinates(client: ServiceClient, interaction: ChatInputCommandInteraction): Promise<void>
{
  if (await new CoordinateStore(client.Services.Database).Clear(interaction.guildId))
  {
    await interaction.reply({ content: "Cleared coordinates successfully." });
    return;
  }
  await interaction.reply({ content: 'Could not clear coordinates.' });
}

function GetUsernames(response: ServerStatus): string[]
{
  if (response.status.players.online == 0 || response.status.players.sample == undefined)
  {
    return [];
  }
  return response.status.players.sample.map(x => x.name);
}

async function SendServerInfo(interaction: ChatInputCommandInteraction): Promise<void>
{
  var embed = new EmbedBuilder()
    .setTitle("Cozy Cosmos Minecraft Server")
    .setColor(colors.purple)
    .setThumbnail('https://i.imgur.com/LmKJGGA.png');

  var button_row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(new ButtonBuilder()
      .setCustomId(MCStatusArgs.RulesButtonID)
      .setLabel("Rules")
      .setStyle(ButtonStyle.Primary));

  try
  {
    var response: ServerStatus = await mc.lookup({ host: MCServerIP, port: MCServerPort, timeout: 1000 });
    embed
      .setDescription(response.status.description)
      .addFields([
        {
          name: `Server Details`,
          value: `Address: \`${MCServerIP}\`\nVersion: \`${response.status.version.name}\``
        }]);
    if (response.status.players.online > 0)
    {
      embed.addFields({
        name: `[${response.status.players.online}/${response.status.players.max}] Players`,
        value: `\`\`\`\n${GetUsernames(response).join("\n")}\n\`\`\``
      });
    }
    else
    {
      embed.setFooter({ text: `[${response.status.players.online}/${response.status.players.max}] Players :(` });
    }
  }
  catch
  {
    embed.setDescription("The minecraft server is not available right now.\nContact a moderator for assistance.")
      .setColor(colors.red);
  }

  interaction.reply({ embeds: [embed], ephemeral: true, components: [button_row] });
}

async function GetCoordinatesMessage(client: ServiceClient, interaction: Interaction, page: number): Promise<InteractionReplyOptions>
{
  const max_page_length = 12;
  var coordinates = await new CoordinateStore(client.Services.Database).GetAll(interaction.guildId);
  let max_page = Math.floor(coordinates.length / (max_page_length + 1));
  if (page > max_page)
  {
    page = max_page;
  }

  let min_index = page * max_page_length;
  let max_index = ((page + 1) * max_page_length) > coordinates.length ? coordinates.length : (page + 1) * max_page_length;

  let coordinate_slice = coordinates.slice(min_index, max_index);

  var embed = new EmbedBuilder()
    .setTitle("Minecraft Server Coordinate Repository")
    .setFooter({ text: `Page ${page + 1}/${max_page + 1}` });

  if (coordinates.length == 0 || page < 0)
  {
    embed.setDescription("Empty...");
  }

  for (const coordinate of coordinate_slice)
  {
    embed.addFields({ name: coordinate.id, value: `${coordinate.x}, ${coordinate.y == null ? "~" : coordinate.y}, ${coordinate.z}${coordinate.dimension == null ? "" : ` (${coordinate.dimension})`}`, inline: true });
  }

  let buttons = new ActionRowBuilder<ButtonBuilder>();
  let includeComponents = false;

  if (page > 0)
  {
    includeComponents = true;
    buttons.addComponents(new ButtonBuilder()
      .setCustomId(MCStatusArgs.CoordinatesPrevPageButtonID)
      .setLabel("<")
      .setStyle(ButtonStyle.Secondary));
  }

  if (page < max_page)
  {
    includeComponents = true;
    buttons.addComponents(new ButtonBuilder()
      .setCustomId(MCStatusArgs.CoordinatesNextPageButtonID)
      .setLabel(">")
      .setStyle(ButtonStyle.Secondary));
  }

  if (includeComponents)
  {
    return { embeds: [embed], ephemeral: true, components: [buttons] };
  }
  return { embeds: [embed], ephemeral: true };
}

async function SendCoordinatesMessage(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  let page = 0;
  let response = await GetCoordinatesMessage(client, interaction, page);
  await interaction.reply(response);
  if (response.components != null)
  {
    client.Services.EventAggregator.Subscribe(`${MCStatusArgs.CoordinatesNextPageButtonID}_${interaction.id}`, async (event) =>
    {
      page++;
      UpdateCoordinates(client, event as ButtonInteraction, page);
    });

    client.Services.EventAggregator.Subscribe(`${MCStatusArgs.CoordinatesPrevPageButtonID}_${interaction.id}`, async (event) =>
    {
      page--;
      UpdateCoordinates(client, event as ButtonInteraction, page);
    });
  }
}

async function UpdateCoordinates(client: ServiceClient, interaction: ButtonInteraction, page: number)
{
  let newMessage = await GetCoordinatesMessage(client, interaction, page);
  interaction.update({ content: newMessage.content, embeds: newMessage.embeds, components: newMessage.components });
}

async function AddCoordinate(client: ServiceClient, interaction: ChatInputCommandInteraction): Promise<void>
{
  let coordinate = GetCoordinateFromOptions(interaction);
  let res: boolean = await new CoordinateStore(client.Services.Database).AddCoordinate(coordinate, interaction.guildId);

  if (res)
  {
    var auditChannel = client.channels.cache.get(IDs.auditLogChannelID);
    if (auditChannel.isTextBased())
    {
      auditChannel.send({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
          .setTitle(interaction.channel.name)
          .setDescription(`Added coordinate ${coordinate.id} (${coordinate.x}, ${coordinate.y}, ${coordinate.z}).`)]
      });
    }

    var embed = new EmbedBuilder()
      .setTitle("Created a coordinate :)")
      .setDescription(`id: ${coordinate.id}, x: ${coordinate.x}, y: ${coordinate.y}, z: ${coordinate.z}, dimension: ${coordinate.dimension}`);

    interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  interaction.reply({ content: "Failed to create coordinate. This coordinate already exists.", ephemeral: true });
}

async function EditCoordinate(client: ServiceClient, interaction: ChatInputCommandInteraction): Promise<void>
{
  let coordinate = GetCoordinateFromOptions(interaction);
  let prev: Coordinate = await new CoordinateStore(client.Services.Database).GetCoordinate(coordinate.id, interaction.guildId);
  let res: boolean = await new CoordinateStore(client.Services.Database).ModifyCoordinate(coordinate, interaction.guildId);

  if (res && prev != null)
  {
    var auditChannel = client.channels.cache.get(IDs.auditLogChannelID);
    if (auditChannel.isTextBased())
    {
      auditChannel.send({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
          .setTitle(interaction.channel.name)
          .setDescription(`Edited coordinate id=${prev.id} (${prev.x}, ${prev.y}, ${prev.z}, dim=${prev.dimension}) => (${coordinate.x}, ${coordinate.y}, ${coordinate.z}, dim=${coordinate.dimension}).`)]
      });
    }

    var embed = new EmbedBuilder()
      .setTitle("Modified a coordinate :)")
      .setDescription(`id: ${coordinate.id}, x: ${coordinate.x}, y: ${coordinate.y}, z: ${coordinate.z}, dimension: ${coordinate.dimension}`);

    interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  interaction.reply({ content: "Failed to modify coordinate. This coordinate does not exist.", ephemeral: true });
}

function GetCoordinateFromOptions(interaction: ChatInputCommandInteraction): Coordinate
{
  let id: string = interaction.options.getString(MCStatusArgs.CoordinateDescription);
  let x: number = interaction.options.getInteger(MCStatusArgs.CoordinateX);
  let y: number = interaction.options.getInteger(MCStatusArgs.CoordinateY);
  let z: number = interaction.options.getInteger(MCStatusArgs.CoordinateZ);
  let dimension: string = interaction.options.getString(MCStatusArgs.CoordinateDimension);
  return new Coordinate(id, x, z, y, dimension);
}

async function rulesHandler(client: ServiceClient, interaction: ButtonInteraction)
{
  let embed = new EmbedBuilder()
    .setTitle("Minecraft Server Rules")
    .setDescription("- No exploitation or cheating (x-ray hacking, structure locaters, etc)\n- Don't steal others' things.\n- No griefing.\n- Be friendly.\n- All other server <#760315154864406528> apply");
  interaction.reply({ embeds: [embed], ephemeral: true });
}

async function nextPage(client: ServiceClient, interaction: ButtonInteraction)
{
  const event = `${MCStatusArgs.CoordinatesNextPageButtonID}_${interaction.message.interaction.id}`;
  client.Services.EventAggregator.Invoke(event, interaction);
  if (!client.Services.EventAggregator.HasListener(event))
  {
    interaction.reply({ content: "This message is stale. Please resend to change page.", ephemeral: true });
  }
}

async function prevPage(client: ServiceClient, interaction: ButtonInteraction)
{
  const event = `${MCStatusArgs.CoordinatesPrevPageButtonID}_${interaction.message.interaction.id}`;
  client.Services.EventAggregator.Invoke(event, interaction);
  if (!client.Services.EventAggregator.HasListener(event))
  {
    interaction.reply({ content: "This message is stale. Please resend to change page.", ephemeral: true });
  }
}

function AddCoordinateOptions(cmd: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder
{
  return cmd.addStringOption(option => option
    .setName(MCStatusArgs.CoordinateDescription)
    .setDescription("Unique coordinate identifier")
    .setRequired(true))
    .addIntegerOption(option => option
      .setName(MCStatusArgs.CoordinateX)
      .setDescription("X Coordinate (1st position in minecraft)")
      .setRequired(true))
    .addIntegerOption(option => option
      .setName(MCStatusArgs.CoordinateZ)
      .setDescription("Z Coordinate (3rd position in minecraft)")
      .setRequired(true))
    .addIntegerOption(option => option
      .setName(MCStatusArgs.CoordinateY)
      .setDescription("Y Coordinate (2nd position in minecraft")
      .setRequired(false))
    .addStringOption(option => option
      .setName(MCStatusArgs.CoordinateDimension)
      .setDescription("Dimension")
      .setChoices({ name: "Overworld", value: 'overworld' }, { name: "Nether", value: "nether" }, { name: "End", value: "end" })
      .setRequired(false));
}

const builder = new SlashCommandBuilder()
  .setName("mcinfo")
  .setDescription("Gets information about the minecraft server.")
  .addSubcommand(cmd => cmd
    .setName(MCStatusArgs.ServerCommand)
    .setDescription("Gets server information"))
  .addSubcommand(cmd => cmd
    .setName(MCStatusArgs.CoordinatesCommand)
    .setDescription("Gets coordinate information"))
  .addSubcommand(cmd => AddCoordinateOptions(cmd)
    .setName(MCStatusArgs.AddCoordinateCommand)
    .setDescription("Adds a new coordinate to the coordinate repository"))
  .addSubcommand(cmd => AddCoordinateOptions(cmd
    .setName(MCStatusArgs.EditCoordinateCommand)
    .setDescription("Modifies an existing coordinate in the coordinate repository.")));

const adminCommandBuilder = new SlashCommandBuilder()
  .setName('clear_mc_coordinates')
  .setDescription('Clears the minecraft coordinates saved for this server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const MCStatus = new ApplicationCommand(builder, execute);
const MCAdmin = new ApplicationCommand(adminCommandBuilder, ClearCoordinates);
const MCStatus_Rules = new ApplicationCommand({ name: MCStatusArgs.RulesButtonID }, rulesHandler, CommandType.Button);
const MCStatus_NextPage = new ApplicationCommand({ name: MCStatusArgs.CoordinatesNextPageButtonID }, nextPage, CommandType.Button);
const MCStatus_PrevPage = new ApplicationCommand({ name: MCStatusArgs.CoordinatesPrevPageButtonID }, prevPage, CommandType.Button);

export default MCStatus;
export { MCStatus, MCAdmin, MCStatus_Rules, MCStatus_NextPage, MCStatus_PrevPage };