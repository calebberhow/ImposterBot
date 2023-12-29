import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import colors from "../../util/colors.js";
import ApplicationCommand from "../Infrastructure/ApplicationCommand.js";

async function execute(client: Client, interaction: ChatInputCommandInteraction)
{
  var embed = new EmbedBuilder()
    .setTitle('Here is the Ambush guidebook:')
    .setDescription(`<https://docs.google.com/document/d/1btav7j5xaBKcU1fPQ4i5FyV-GWtneFKixsJLblpX7UE/edit?usp=sharing>`)
    .setColor(colors.orange);
  interaction.reply({ embeds: [embed], ephemeral: true });
}

const builder = new SlashCommandBuilder()
  .setName('ambushwiki')
  .setDescription('gets information about the game `ambush`');

export default new ApplicationCommand(builder, execute);