const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fs = require('fs');
const lib = require('../util/lib.js');
const colors = require('../util/colors.js');

const slap_assets_dir = './assets/slap';

module.exports.data = new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap your friend!')
    .addUserOption(option => option
        .setName('target')
        .setDescription('user you want to slap')
        .setRequired(true))

module.exports.execute = async (client, interaction) => {
    target = interaction.options.getUser('target');
    author = interaction.member.user;

    const r = Math.floor(Math.random() * fs.readdirSync(slap_assets_dir).length) + 1;
    
    let embd = new EmbedBuilder()
      .setTitle((target.username===author.username)? `${author.username} slaps themself`:`${author.username} slaps ${target.username}`)
      .setDescription(lib.randMessage(["R I P", `Bad ${author.username}`, "That sounded painful."]))
      .setColor(colors.purple)
      .setImage(`attachment://${r}.gif`);
    
    await interaction.reply({
        embeds: [embd],
        files: [{
            attachment: `./assets/slap/${r}.gif`,
            name: `${r}.gif`
        }]
    });
}
