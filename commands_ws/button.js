const {SlashCommandBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, ActionRowBuilder} = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('button')
    .setDescription('buttons!! (WIP).')


module.exports.execute = async (interaction) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Click me!')
					.setStyle(ButtonStyle.Primary),
        );
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Some title')
        .setURL('https://discord.js.org')
        .setDescription('Some description here');

    await interaction.reply({ content: 'I think you should,', embeds: [embed], components: [row] });
}