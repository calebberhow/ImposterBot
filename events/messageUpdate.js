import Discord from 'discord.js';
import ids from '../ids_manager.js';
import lib from '../util/lib.js';

export default (client, oldMessage, newMessage) => {
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