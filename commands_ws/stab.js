const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('stab')
    .setDescription('stab your friend (WIP)')
    .addStringOption(option => option
        .setName('user')
        .setDescription('friend you would like to stab')
        .setRequired(true));


// Replies with ephemeral confirmation message.
// Then sends a seperate message in the chat (interaction.channel.send) with the stabbing/
// Add buttons (or context menus) for 
module.exports.execute = async (interaction) => {
    await interaction.reply("Not yet implemented");
}