import Discord, { Events } from 'discord.js';
import ids from '../ids_manager.js'
import colors from '../util/colors.js'
import EventHandler from './Infrastructure/EventHandler.js';

async function OnGuilMemberAdd(client: Discord.Client, member: Discord.GuildMember)
{
  // give newcomers members role
  if (member.guild.id !== ids.cozycosmos) {
    return;
  }
  const memberRole = member.guild.roles.cache.find(role => role.name === "Members");
  member.roles.add(memberRole).catch(console.error);
  
  // send welcome message
  const channel: Discord.Channel = client.channels.cache.get(ids.welcomeChannelID);

  if (channel.isTextBased())
  {
    let embd = new Discord.EmbedBuilder()
      .setDescription(`**${member.user.username}** has joined!`)
      .setAuthor({name:"𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 𝙲𝚘𝚣𝚢 𝙲𝚘𝚜𝚖𝚘𝚜!", iconURL:member.user.displayAvatarURL()})
      .setColor(colors.royalblue)
      .setThumbnail(`attachment://cozyanim.gif`)
      .setFooter({text: 'Member Count: ' + member.guild.memberCount})
      .addFields([{name:"\u200b", value:'Check out <#760324523572330497> for customization!'}]);
    channel.send({
      content:`Welcome, ${member.user}! ${client.emojis.cache.get(ids.helloEmoteID)}`,
      embeds: [embd],
      files: [{
          attachment: `./assets/cozyanim.gif`, 
          name: `cozyanim.gif`
        }]
    });
  }
}

export default new EventHandler(Events.GuildMemberAdd, OnGuilMemberAdd);