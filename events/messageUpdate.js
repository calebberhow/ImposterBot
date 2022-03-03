const Discord = require('discord.js');
const ids = require('../ids');
const lib = require('../util/lib.js');

module.exports = (client, oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    
    lib.moderate(newMessage);
    if (newMessage.guild.id === ids.cozycosmos) {
        auditEmbed = new Discord.MessageEmbed()
            .setAuthor(newMessage.author.username, newMessage.author.displayAvatarURL())
            .setTitle(newMessage.channel.name)
            .setDescription(newMessage.content)
            .setTimestamp()
            .setFooter('This message was edited from a previous message.');
        newMessage.guild.channels.cache.get(ids.auditLogChannelID).send(auditEmbed);
  }
}