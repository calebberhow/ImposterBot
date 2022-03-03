const Discord = require('discord.js');
const ids = require('../ids.json');
const colors = require('../util/colors.js');

module.exports.run = async (client, message, args) => {
  var embed = new Discord.MessageEmbed()
    .setTitle('Here is the Ambush guidebook:')
    .setDescription(
`<https://docs.google.com/document/d/1btav7j5xaBKcU1fPQ4i5FyV-GWtneFKixsJLblpX7UE/edit?usp=sharing>`)
    .setColor(colors.orange)
    .setFooter("If the !ambush command is broken, please contact @Cressy#4851 or @Khazaari#1515.")
  message.channel.send(embed);
}

module.exports.config = {
  name: 'ambushwiki',
  aliases: ['ambushhelp', 'ambushcommands']
};