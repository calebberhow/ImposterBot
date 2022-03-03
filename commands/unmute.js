/*
Allows moderators to unmute any person on the server. 
Removes the role "Temp-mute".
Use by : "!unmute @user"
*/

const lib = require('../util/lib.js');

module.exports.run = async (client, message, args) => {
    if(lib.isModerator(message.member)) {
        const user = message.guild.member(message.mentions.users.first())
        var role = user.guild.roles.cache.find(role => role.name === "Temp-mute");
        user.roles.remove(role);
        return message.react("✅")
    }
    message.react("❌")
}

module.exports.config = {
  name: 'unmute',
  aliases: []
};