import Discord, { SlashCommandBuilder, Client, ChatInputCommandInteraction } from 'discord.js'
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

const builder = new SlashCommandBuilder()
		.setName("say2")
		.setDescription("Say Command.");

async function execute(client: Client, interaction: ChatInputCommandInteraction) {
	interaction.reply({ content: "hi", ephemeral: true });
}

export default new ApplicationCommand(builder, execute);