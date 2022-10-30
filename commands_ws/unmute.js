const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');


module.exports.data = new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('unmute a member (WIP)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName('member')
        .setDescription('member you would like to mute')
        .setRequired(true));

module.exports.execute = async (client, interaction) => {
    await interaction.reply({content: "Not yet implemented", ephemeral: true});
}
