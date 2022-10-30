const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('roll a dice!')
    .addIntegerOption(option => option
        .setName('sides')
        .setDescription('Number of sides you want on the dice you roll')
        .setRequired(true)
        .addChoices(
           {name: 'd4', value: 4},
           {name: 'd6', value: 6},
           {name: 'd8', value: 8},
           {name: 'd10', value: 10},
           {name: 'd12', value: 12},
           {name: 'd20', value: 20},
        ))
    .addIntegerOption(option => option
        .setName('modifier')
        .setDescription('amount to modify roll by')
        .setRequired(false));

module.exports.execute = async (interaction) => {
    const sides = interaction.options.getInteger('sides', true);
    const modifier = interaction.options.getInteger('modifier', false);
    const random = Math.ceil(Math.random() * sides);
    const author = interaction.member.user;
    var embd = new EmbedBuilder()
        .setThumbnail(`attachment://${random}.png`)
        .setAuthor({name:`${author.username} rolls 1d${sides}`, iconURL: author.displayAvatarURL()})
        .setColor(makeColor(random, sides))
        .setDescription(`${random == 1 ? "Critical **FAIL**" : `It rolled ${random}`}${!modifier ? "" : ` + ${modifier} (${random+modifier})`}!`);
    
    await interaction.reply({
        embeds: [embd],
        files: [{
            attachment: `./assets/d${sides}/d${sides}-${random}.png`,
            name: `${random}.png`
        }]
    });
}

function makeColor(value, max) {
    if (value == -1) return [111, 255, 200]

    let greenValue = Math.min(255 * (value-1)/(max/2), 255)
    let redValue = Math.min(255 * (max-value)/(max/2), 255)

    return [redValue, greenValue, 0]
}
