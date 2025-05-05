import { Channel, EmbedBuilder, Events, Message, TextChannel } from 'discord.js';
import ids from '../ids_manager.js';
import lib from '../util/lib.js';
import EventHandler from './Infrastructure/EventHandler.js';
import ServiceClient from '../ServiceClient.js';

async function OnMessageUpdate(client: ServiceClient, oldMessage: Message, newMessage: Message)
{
  if (newMessage.author.bot)
  {
    return;
  }

  lib.moderate(newMessage);
  if (newMessage.guild.id === ids.cozycosmos && newMessage.channel.isTextBased())
  {
    let auditEmbed = new EmbedBuilder()
      .setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL() })
      .setTitle((newMessage.channel as TextChannel).name)
      .setDescription(newMessage.content)
      .setTimestamp()
      .setFooter({ text: 'This message was edited from a previous message.' });
    const auditLog: Channel = newMessage.guild.channels.cache.get(ids.auditLogChannelID);
    if (auditLog.isTextBased())
    {
      auditLog.send({ embeds: [auditEmbed] });
    }
  }
}

export default new EventHandler(Events.MessageUpdate, OnMessageUpdate);