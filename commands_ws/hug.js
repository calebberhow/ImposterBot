const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fs = require('fs');
const lib = require('../util/lib.js');
const colors = require('../util/colors.js');

const hug_assets_dir = './assets/hug';

module.exports.data = new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug your friend!')
    .addUserOption(option => option
        .setName('target')
        .setDescription('user you want to hug')
        .setRequired(true))

module.exports.execute = async (interaction) => {
    target = interaction.options.getUser('target');
    author = interaction.member.user;

    const r = Math.floor(Math.random() * fs.readdirSync(hug_assets_dir).length) + 1;
    
    const embd = new EmbedBuilder()
        .setTitle((author.username===target.username)? `${author.username} hugs themself`:`${author.username} hugs ${target.username}`)
        .setDescription(lib.randMessage(["A wild hug appeared!","You are now my hostage.","*Squish*"]))
        .setColor(colors.purple)
        .setImage(`attachment://${r}.gif`);
    
    await interaction.reply({
        embeds: [embd],
        files: [{
            attachment: `./assets/hug/${r}.gif`,
            name: `${r}.gif`
        }]
    });
}
