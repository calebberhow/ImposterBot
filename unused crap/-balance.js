const ids = require('../ids.json')

module.exports.run = async (client, message, args) => {
  var dbObjects = require('../dbObjects.js')
  var userCollection = dbObjects.userCollection;
  const coinEmoji = client.emojis.cache.get(ids.coinEmoji);
  const target = message.mentions.users.first() || message.author;
  message.channel.send(`${(target===message.author)? 'You have':`${target.username} has`} **${userCollection.getBalance(target.id)}** ${coinEmoji}.`);
}

module.exports.config = {
  name: 'balance',
  aliases: ['bal']
};