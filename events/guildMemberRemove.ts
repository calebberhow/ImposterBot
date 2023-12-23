import Discord, { Events } from 'discord.js'
import ids from '../ids_manager.js';
import EventHandler from './Infrastructure/EventHandler.js';

async function OnGuildMemberRemove(client: Discord.Client, member: Discord.GuildMember)
{
  if (member.guild.id !== ids.cozycosmos) return;
  const welcomeChannel = client.channels.cache.get(ids.welcomeChannelID);
  if (welcomeChannel.isTextBased())
  {
    welcomeChannel.send(`> Goodbye, ${member.user.username}! ${client.emojis.cache.get(ids.cyaEmoteID)}`);
  }
}

export default new EventHandler(Events.GuildMemberRemove, OnGuildMemberRemove);