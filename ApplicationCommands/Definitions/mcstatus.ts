import mc from "minecraftstatuspinger";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder, SlashCommandSubcommandBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
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
	switch(interaction.options.getSubcommand())
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
			interaction.reply({ embeds:[new EmbedBuilder().setTitle("Oops, your request could not be processed...")], ephemeral:true });
			return 
	}
};

function GetUsernames(response: ServerStatus)
{
	if (response.status.players.online ==  0 || response.status.players.sample == undefined)
	{
		return [];
	}
	return response.status.players.sample.map(x => x.name)
}

async function SendServerInfo(interaction: ChatInputCommandInteraction) : Promise<void>
{
	var embed = new EmbedBuilder()
		.setTitle("Cozy Cosmos Survival Server")
		.setColor(colors.purple)
		.addFields([
		{
			name: `Server Details`,
			value: `\`${MCServerIP}\``
		}]);
	var button_row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(new ButtonBuilder()
			.setCustomId(MCStatusArgs.RulesButtonID)
			.setLabel("Rules")
			.setStyle(ButtonStyle.Primary));

	try 
	{
		var response: ServerStatus = await mc.lookup({host: MCServerIP, port: MCServerPort, timeout: 1000});
		if (response.status.players.online > 0)
		{
			embed.addFields({
				name: `[${response.status.players.online}/${response.status.players.max}] Players`,
				value: `\`\`\`\n${GetUsernames(response).join("\n")}\n\`\`\``
			});
		}
		else 
		{
			embed.setFooter({ text: `[${response.status.players.online}/${response.status.players.max}] Players :(`});
		}
	}
	catch 
	{
		embed.setDescription("The minecraft server is not available right now.\nContact a moderator for assistance.")
			.setColor(colors.red);
	}

	interaction.reply({ embeds: [embed], ephemeral: true, components: [button_row] });
}

async function GetCoordinatesMessage(client: ServiceClient, page: number) : Promise<InteractionReplyOptions>
{
	const max_page_length = 12;
    var coordinates = await new CoordinateStore(client.Services.Database).GetAll();
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
		.setFooter({ text: `Page ${page + 1}/${max_page + 1}`});

	if (coordinates.length == 0 || page < 0)
    {
		embed.setDescription("Empty...")
    }

	for(const coordinate of coordinate_slice)
	{
		embed.addFields({ name: coordinate.id, value: `${coordinate.x}, ${coordinate.y == null ? "~" : coordinate.y}, ${coordinate.z}${coordinate.dimension == null ? "" : ` (${coordinate.dimension})`}`, inline: true})
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
		return { embeds: [embed], ephemeral: true, components: [buttons]  };
	}
	return { embeds: [embed], ephemeral: true };
}

async function SendCoordinatesMessage(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
	let page = 0;
	let response = await GetCoordinatesMessage(client, page);
	await interaction.reply(response);
	if (response.components != null)
	{
		client.Services.EventAggregator.Subscribe(MCStatusArgs.CoordinatesNextPageButtonID, async (event) => {
			let buttonInteraction = event as ButtonInteraction;
			if (buttonInteraction.message.interaction.id == interaction.id)
			{
				page++;
				UpdateCoordinates(client, buttonInteraction, page);
			}
		});

		client.Services.EventAggregator.Subscribe(MCStatusArgs.CoordinatesPrevPageButtonID, async (event) => {
			let buttonInteraction = event as ButtonInteraction;
			if (buttonInteraction.message.interaction.id == interaction.id)
			{
				page--;
				UpdateCoordinates(client, buttonInteraction, page);
			}
		});
	}
}

async function UpdateCoordinates(client:ServiceClient, interaction: ButtonInteraction, page: number)
{
	let newMessage = await GetCoordinatesMessage(client, page)
	interaction.update({ content: newMessage.content, embeds: newMessage.embeds, components: newMessage.components });
}

async function AddCoordinate(client: ServiceClient, interaction: ChatInputCommandInteraction) : Promise<void>
{
	var id: string = interaction.options.getString(MCStatusArgs.CoordinateDescription)
	var x: number = interaction.options.getInteger(MCStatusArgs.CoordinateX);
	var y: number = interaction.options.getInteger(MCStatusArgs.CoordinateY);
	var z: number = interaction.options.getInteger(MCStatusArgs.CoordinateZ);
	var dimension: string = interaction.options.getString(MCStatusArgs.CoordinateDimension);

	let res:boolean = await new CoordinateStore(client.Services.Database).AddCoordinate(new Coordinate(id, x, z, y, dimension));

	if (res)
	{
		var auditChannel = client.channels.cache.get(IDs.auditLogChannelID)
		if (auditChannel.isTextBased())
		{
			auditChannel.send({ embeds: [new EmbedBuilder()
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() } )
				.setTitle(interaction.channel.name)
				.setDescription(`Added coordinate ${id} (${x}, ${y}, ${z}).`)] })
		}

		var embed = new EmbedBuilder()
			.setTitle("Created a coordinate :)")
			.setDescription(`id: ${id}, x: ${x}, y: ${y}, z: ${z}, dimension: ${dimension}`);
		
		interaction.reply({ embeds: [embed], ephemeral: true });
		return;
	}
	
	interaction.reply({ content: "Failed to create coordinate. This coordinate already exists.", ephemeral: true });
}

async function EditCoordinate(client: ServiceClient, interaction: ChatInputCommandInteraction ) : Promise<void>
{
	var id: string = interaction.options.getString(MCStatusArgs.CoordinateDescription)
	var x: number = interaction.options.getInteger(MCStatusArgs.CoordinateX);
	var y: number = interaction.options.getInteger(MCStatusArgs.CoordinateY);
	var z: number = interaction.options.getInteger(MCStatusArgs.CoordinateZ);
	var dimension: string = interaction.options.getString(MCStatusArgs.CoordinateDimension);
	let prev:Coordinate = await new CoordinateStore(client.Services.Database).GetCoordinate(id);
	let res:boolean = await new CoordinateStore(client.Services.Database).ModifyCoordinate(new Coordinate(id, x, z, y, dimension));

	if (res && prev != null)
	{
		var auditChannel = client.channels.cache.get(IDs.auditLogChannelID)
		if (auditChannel.isTextBased())
		{
			auditChannel.send({ embeds: [new EmbedBuilder()
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() } )
				.setTitle(interaction.channel.name)
				.setDescription(`Edited coordinate id=${prev.id} (${prev.x}, ${prev.y}, ${prev.z}, dim=${prev.dimension}) => (${x}, ${y}, ${z}, dim=${dimension}).`)] })
		}

		var embed = new EmbedBuilder()
			.setTitle("Modified a coordinate :)")
			.setDescription(`id: ${id}, x: ${x}, y: ${y}, z: ${z}, dimension: ${dimension}`);
		
		interaction.reply({ embeds: [embed], ephemeral: true });
		return;
	}

	interaction.reply({ content: "Failed to modify coordinate. This coordinate does not exist.", ephemeral: true });
}

async function rulesHandler(client: ServiceClient, interaction: ButtonInteraction)
{
	let embed = new EmbedBuilder()
		.setTitle("Minecraft Server Rules")
		.setDescription("- No exploitation or cheating (x-ray hacking, structure locaters, etc)\n- Don't steal others' things.\n- No griefing.\n- Be friendly.\n- All other server <#760315154864406528> apply");
	interaction.reply({embeds: [embed], ephemeral: true });
}

async function nextPage(client: ServiceClient, interaction: ButtonInteraction)
{
	client.Services.EventAggregator.Invoke(MCStatusArgs.CoordinatesNextPageButtonID, interaction);
}

async function prevPage(client: ServiceClient, interaction: ButtonInteraction)
{
	client.Services.EventAggregator.Invoke(MCStatusArgs.CoordinatesPrevPageButtonID, interaction);
}

function AddCoordinateOptions(cmd: SlashCommandSubcommandBuilder) : SlashCommandSubcommandBuilder
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
		.setChoices({ name:"Overworld", value:'overworld' }, { name:"Nether", value: "nether" }, { name:"End", value:"end" })
		.setRequired(false))
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

const MCStatus = new ApplicationCommand(builder, execute);
const MCStatus_Rules = new ApplicationCommand({name: MCStatusArgs.RulesButtonID}, rulesHandler, CommandType.Button);
const MCStatus_NextPage = new ApplicationCommand({name: MCStatusArgs.CoordinatesNextPageButtonID}, nextPage, CommandType.Button);
const MCStatus_PrevPage = new ApplicationCommand({name: MCStatusArgs.CoordinatesPrevPageButtonID}, prevPage, CommandType.Button);

export default MCStatus;
export { MCStatus, MCStatus_Rules, MCStatus_NextPage, MCStatus_PrevPage };