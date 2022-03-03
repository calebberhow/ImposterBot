const Discord = require('discord.js');
const colors = require('../util/colors.js')
module.exports.run = async (client, message, args) => {
  var dbObjects = require('../dbObjects.js')
  var userCollection = dbObjects.userCollection;
  embed = new Discord.MessageEmbed()
    .setTitle('Leaderboard')
    .setDescription(userCollection.sort((a, b) => b.balance - a.balance)
      .filter(user => client.users.cache.has(user.user_id))
      .first(10)
      .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance} 🪙`)
      .join('\n'))
    .setColor(colors.slate)
  message.channel.send(embed)
}

module.exports.config = {
  name: 'leaderboard',
  aliases: ['lb']
};