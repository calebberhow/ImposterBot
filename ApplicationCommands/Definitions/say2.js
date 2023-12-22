import Discord from 'discord.js'

export default {
	data: new Discord.SlashCommandBuilder()
		.setName("say2")
		.setDescription("Say Command."),

	async execute(client, interaction, args) {
		interaction.reply({ content: "hi", ephemeral: true });
	},
}
