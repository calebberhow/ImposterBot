import Discord from 'discord.js';

export default {
	data: new Discord.SlashCommandBuilder()
		.setName("say")
		.setDescription("Say Command.")
		.addStringOption(option => option
			.setName("text")
			.setDescription("You can print something on the bot.")
			.setRequired(true)),
			
	async execute(client, interaction, args) {
		interaction.reply({ content:args.getString("text", true) });
	},
}
