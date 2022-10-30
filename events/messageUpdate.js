const {Events, EmbedBuilder } = require('discord.js');
const ids = require('../ids_manager');
const lib = require('../util/lib.js');

module.exports = {
    name: Events.MessageUpdate,
    once: false,
}

module.exports.execute = (oldMessage, newMessage) => {    
    if (newMessage.author.bot) return;
    
    if (newMessage.guild.id === ids.cozycosmos) {
        lib.moderate(newMessage);
        auditEmbed = new EmbedBuilder()
            .setAuthor({text: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL()})
            .setTitle(newMessage.channel.name)
            .setDescription(newMessage.content)
            .setTimestamp()
            .setFooter('This message was edited from a previous message.');
        newMessage.guild.channels.cache.get(ids.auditLogChannelID).send(auditEmbed);
  }
}