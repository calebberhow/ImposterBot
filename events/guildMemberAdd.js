const Discord = require('discord.js');
const ids = require('../ids_manager');
const colors = require('../util/colors.js');

module.exports = {
    name: Discord.Events.GuildMemberAdd,
    once: false,
}

module.exports.execute = (client, member) => {
  // give newcomers members role
  if (member.guild.id !== ids.cozycosmos) return;
  const memberRole = member.guild.roles.cache.find(role => role.name === "Members");
  member.roles.add(memberRole).catch(console.error);
  
  // send welcome message
  const channel = client.channels.cache.get(ids.welcomeChannelID);
  let embd = new Discord.MessageEmbed()
    .setDescription(`**${member.user.username}** has joined!`)
    .setAuthor("𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 𝙲𝚘𝚣𝚢 𝙲𝚘𝚜𝚖𝚘𝚜!",member.user.displayAvatarURL())
    .setColor(colors.royalblue)
    .setThumbnail(`attachment://cozyanim.gif`)
    .setFooter('Member Count: ' + member.guild.memberCount)
    .addField("\u200b",'Check out <#760324523572330497> for customization!');
  channel.send(`Welcome, ${member.user}! ${client.emojis.cache.get(ids.helloEmoteID)}`,{
    embed: embd,
    files: [
      {attachment: `./assets/cozyanim.gif`, name: `cozyanim.gif`}
    ]
  });
}