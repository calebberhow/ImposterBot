/*
Allows moderators to mute any person on the server. 
Adds the role "Temp-mute", which give them access to only a select few channels, including "you-are-muted."
Use by : "!mute @user"
*/

const lib = require('../util/lib.js');

module.exports.run = async (client, message, args) => {
    if(lib.isModerator(message.member)) {
        if (message.mentions.users.first() == null) return message.react("❓")
    const user = message.guild.member(message.mentions.users.first())
    var role = user.guild.roles.cache.find(role => role.name === "Temp-mute");
    user.roles.add(role);
    return message.react("✅")
  }
  message.react("❌")
}

module.exports.config = {
  name: 'mute',
  aliases: []
};