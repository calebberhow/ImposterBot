const Discord = require('discord.js');
const ids = require('../ids_manager');
const colors = require('../util/colors.js');

module.exports.run = async (client, message, args) => {
  var embed = new Discord.MessageEmbed()
    .setTitle('Here are the commands. Also, check out the Cozy Cosmos website at: https://imposterbot.cressykitr.repl.co')
    .setColor(colors.purple)
    .addFields(
      {name: 'Fun', value: `**${ids.prefix}coinflip:** Flips a coin to get heads or tails.\n**${ids.prefix}d20:** Rolls a 20 sided die.\n**${ids.prefix}hug:** Hugs the tagged user.\n**${ids.prefix}headpat:** Headpats the tagged user.\n**${ids.prefix}slap:** Slaps the tagged user.\n**${ids.prefix}ambush:** Starts an "ambush" game if you tag a user.\n**${ids.prefix}ambushwiki:** Sends a link of the rules and guide book for the "Ambush" command.\n**${ids.prefix}blackjack:** Play a nice game of blackjack.\n`,inline: true},
      {name: 'Utility', value: `**${ids.prefix}host:** Use this command to host an Among Us game and ping the lobby-pings role in the #active-games channel.\n**${ids.prefix}skribble:** Use this command to host a Skribbl.io game and ping the other-games role in the #active-games channel.\n**${ids.prefix}minecraft:** Use this command to see Imposterbot's Minecraft server info as well as the server's current status!\n**${ids.prefix}embed:** Allows a user to easily make an embed with vast customizability.\n**${ids.prefix}embedhelp:** Explains in detail how to use the embed command.`, inline: true}
      )
  message.channel.send(embed);
}

module.exports.config = {
  name: 'commands',
  aliases: ['help'],
  essential: true
};