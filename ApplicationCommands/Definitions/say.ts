import { Client, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

const builder = new SlashCommandBuilder()
  .setName("say")
  .setDescription("Say Command.")
  .addStringOption(option => option
    .setName("text")
    .setDescription("You can print something on the bot.")
    .setRequired(true));

async function execute(client: Client, interaction: ChatInputCommandInteraction)
{
  interaction.reply({ content: interaction.options.getString("text", true) });
}

export default new ApplicationCommand(builder, execute);
