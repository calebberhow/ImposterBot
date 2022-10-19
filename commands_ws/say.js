const say = require('../util/lib').say;

module.exports = {
	name: "say",
	description: "Say command.",
	options: [
		{
			name: "text",
			description: "You can print something on the bot.",
			type: 3,
			required: true,
		}
	],

	async execute(client, interaction, args) {
		await say(client, interaction, args[0].value);
	},
}
