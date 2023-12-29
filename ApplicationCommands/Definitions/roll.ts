import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import ServiceClient from "../../ServiceClient.js";
import ApplicationCommand from "../Infrastructure/ApplicationCommand.js";

async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  let sides = interaction.options.getInteger('sides');
  let modifier = interaction.options.getInteger('modifier');
  if (modifier == null)
  {
    modifier = 0;
  }
  var random = Math.ceil(Math.random() * sides);
  let embd = new EmbedBuilder()
    .setThumbnail(`attachment://d${sides}_${random}.png`)
    .setAuthor({ name: `${interaction.user.displayName} rolls 1d${sides}`, iconURL: interaction.user.avatarURL() })
    .setColor(makeColor(random, sides))
    .setDescription(`${random == 1 ? "Critical **FAIL**" : `It rolled ${random}`}${!modifier ? "" : ` + ${modifier} (${random + modifier})`}!`);
  interaction.reply({
    embeds: [embd],
    files: [{
      attachment: `./assets/d${sides}/d${sides}-${random}.png`,
      name: `d${sides}_${random}.png`
    }]
  });
}

const config = {
  name: 'roll',
  aliases: ["r"]
};

function makeColor(value: number, max: number): ColorResolvable
{
  if (value == -1) return [111, 255, 200];

  let greenValue = Math.min(255 * (value - 1) / (max / 2), 255);
  let redValue = Math.min(255 * (max - value) / (max / 2), 255);

  return [redValue, greenValue, 0];
}

const builder = new SlashCommandBuilder()
  .setName('roll')
  .setDescription('rolls a dice with the given sides/modifier')
  .addIntegerOption(opt => opt
    .setName('sides')
    .setDescription('number of sides for the dice')
    .setRequired(true)
    .addChoices(
      { name: 'd4', value: 4 },
      { name: 'd6', value: 6 },
      { name: 'd8', value: 8 },
      { name: 'd10', value: 10 },
      { name: 'd12', value: 12 },
      { name: 'd20', value: 20 }))
  .addIntegerOption(opt => opt
    .setName('modifier')
    .setDescription('adds a modifier to your roll')
    .setRequired(false));

export default new ApplicationCommand(builder, execute);
