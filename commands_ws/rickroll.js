const {SlashCommandBuilder} = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('rickroll')
    .setDescription('Rickroll your voice channel! (WIP).')

module.exports.execute = (client, interaction) => {
    interaction.reply('Not yet implemented!');
}