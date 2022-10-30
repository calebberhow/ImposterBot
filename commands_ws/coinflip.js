const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lib = require('../util/lib.js');
module.exports.data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('flip a coin');

module.exports.execute = async (interaction) => {
    var rand = lib.randMessage(["It's heads.", "It's tails."])
    var embd = new EmbedBuilder()
        .setTitle('Coin Flip')
        .setDescription(rand)
        .setColor(colors.slate);

    await interaction.reply({embeds: [embd]});
}