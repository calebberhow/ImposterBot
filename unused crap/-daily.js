const ids = require('../ids.json')

module.exports.run = async (client, message, args) => {
  var dbObjects = require('../dbObjects.js')
  var userCollection = dbObjects.userCollection;
  const coinEmoji = client.emojis.cache.get(ids.coinEmoji);
  const has_daily = await userCollection.timeSinceDaily(message.author.id) >= 86400;
  const daily_amt = 5;
  if(has_daily === false) {
    const timeSinceDaily = await userCollection.timeSinceDaily(message.author.id)
    const timestamp = 86400 - Math.floor(timeSinceDaily)
    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - (hours * 60);
    const seconds = timestamp % 60;
    const formatted = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    message.channel.send(`You have already receieved your daily. Time until daily refreshes: ${formatted}.`);
  }
  else {
    userCollection.add(message.author.id, daily_amt);
    newBal = userCollection.getBalance(message.author.id);
    userCollection.setDaily(message.author.id);
    message.channel.send(`You receive ${daily_amt} ${coinEmoji}. Your balance is now ${newBal} ${coinEmoji}.`);
  }
}

module.exports.config = {
  name: 'daily',
  aliases: ['d']
};