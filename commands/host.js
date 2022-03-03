const Discord = require('discord.js');
const ids = require('../ids.json');
const colors = require('../util/colors.js');
module.exports.run = async (client, message, args) => {
  var activegames;
  if(message.guild.id === ids.cozycosmos) activegames = message.guild.channels.cache.get(ids.activegamesChannelID);
  else activegames = message.channel;
  // Checks to see if !host and 4 arguments have been passed. If so, host game
  if (message.content.split(' ').length == 5) {
    sendHostEmbed(message,activegames);
  }

  // Otherwise, allow for arguments to be passed after !host has been sent.
  else {
    message.reply('please send join code, map, server region, and imposter count. (Ex. **REOSJQ The_Skeld North_America 2** ). \n**Once the game lobby is full, react to the active game embed with a :x: reaction.**');
    message.channel.awaitMessages(m => m.author.id == message.author.id,
      { max: 1, time: 75000 }).then(collected => {
        msg = collected.first()
        // Check if we got an appropriate message before moving on
        if (msg.content.split(' ').length === 4) {
          sendHostEmbed(msg,activegames);
        }
        else message.channel.send('Please try again in the correct format.');
      }).catch(() => {
        message.reply('It appears there is an error or timeout, please try again. If this continues, please ping admin.');
      });
  }
}

// Creates Embed based on arguments passed into !host command
function sendHostEmbed (message,activegames) {
  splitmsg = message.content.split(' ');
  code = splitmsg[0]
  mapLocation = splitmsg[1].split('_').join(' ')
  region = splitmsg[2].split('_').join(' ')
  imposters = splitmsg[3]
  var embed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`**Join code: ${code}\nMap: ${mapLocation}\nServer Region: ${region}\nImposter Count: ${imposters}**\n \n(If there is a :x: reaction at the bottom by the host, the game lobby is full. Please do not react unless you are the lobby host.`)
    .setTimestamp(new Date())
    .setThumbnail('https://i.imgur.com/ti8MDoI.png')
    .setColor(colors.purple)
  // Sends the embed with game information to the active games channel
  activegames.send(embed);
  // Pings the lobby pings role
  if(message.guild.id === ids.cozycosmos) activegames.send(`<@&${ids.lobbypingsRoleID}>`);
  message.channel.send('The active games channel has been pinged!');
}

module.exports.config = {
  name: 'host',
  aliases: [],
  essential: true
};