const ids = require('../ids_manager');

module.exports = (client, member) => {
  if (member.guild.id !== ids.cozycosmos) return;
  welcomeChannel = client.channels.cache.get(ids.welcomeChannelID);
  welcomeChannel.send(`> Goodbye, ${member.user.username}! ${client.emojis.cache.get(ids.cyaEmoteID)}`);
}