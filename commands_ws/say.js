const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say command.')
        .addStringOption(option => option
                .setName('text')
                .setDescription('text to say.')
                .setRequired(true))
}


module.exports.execute = async (client, interaction) => {
    await interaction.reply(interaction.options.getString('text'));
}
