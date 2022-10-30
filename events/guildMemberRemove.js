const Discord = require('discord.js')
const ids = require('../ids_manager');
module.exports = {
    name: Discord.Events.GuildMemberRemove,
    once: false,
}

module.exports.execute = (client, member) => {
    if (member.guild.id !== ids.cozycosmos) return;
    welcomeChannel = client.channels.cache.get(ids.welcomeChannelID);
    welcomeChannel.send(`> Goodbye, ${member.user.username}! ${client.emojis.cache.get(ids.cyaEmoteID)}`);
}