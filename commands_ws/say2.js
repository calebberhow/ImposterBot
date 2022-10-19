const say = require('../util/lib').say;

module.exports = {
	name: "say2",
	description: "Say command.",
	options: [],

	async execute(client, interaction, args) {
		await say(client, interaction, "hi");
	},
}
