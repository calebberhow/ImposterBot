import Discord, { Events, TextChannel } from 'discord.js';
import ids from '../ids_manager.js';
import lib from '../util/lib.js';
import EventHandler from './Infrastructure/EventHandler.js';

async function OnMessageUpdate(client: Discord.Client, oldMessage: Discord.Message, newMessage: Discord.Message)
{
    if (newMessage.author.bot) {
        return;
    }
    
    lib.moderate(newMessage);
    if (newMessage.guild.id === ids.cozycosmos && newMessage.channel.isTextBased()) {
        let auditEmbed = new Discord.EmbedBuilder()
            .setAuthor({name:newMessage.author.username, iconURL:newMessage.author.displayAvatarURL()})
            .setTitle((newMessage.channel as TextChannel).name)
            .setDescription(newMessage.content)
            .setTimestamp()
            .setFooter({text:'This message was edited from a previous message.'});
        const auditLog: Discord.Channel = newMessage.guild.channels.cache.get(ids.auditLogChannelID)
        if (auditLog.isTextBased())
        {
            auditLog.send({embeds:[auditEmbed]});
        }
  }
}

export default new EventHandler(Events.MessageUpdate, OnMessageUpdate);