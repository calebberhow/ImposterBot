const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('stab')
    .setDescription('stab your friend (WIP)')
    .addStringOption(option => option
        .setName('user')
        .setDescription('friend you would like to stab')
        .setRequired(true));

module.exports.execute = async () => {
    await interaction.reply("Not yet implemented");
}