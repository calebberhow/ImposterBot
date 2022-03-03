const { Users, CurrencyShop, UserItems, userCollection } = require('../dbObjects');
const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
  var dbObjects = require('../dbObjects.js');
  var userCollection = dbObjects.userCollection;
  const target = message.mentions.users.first() || message.author;
  const bal = userCollection.getBalance(target.id);
  const xp = userCollection.getxp(target.id);
  const level = userCollection.getLevel(target.id);
  const user = await Users.findOne({ where: { user_id: target.id } });
  const badges = await user.getItems();
  const color = userCollection.getColor(target.id);
  var embed = new Discord.MessageEmbed()
    .setTitle(`${message.author.username}'s Profile!`)
    .setDescription(`Badges: ${(badges.length)? badges.map(i => `${client.emojis.cache.get(i.emojiID)}`).join(' '): 'None'}\nBalance: ${bal}\nExperience: ${xp}\nLevel: ${level}`)
    .setColor(color);
  message.channel.send(embed);
}

module.exports.config = {
  name: 'profile',
  aliases: []
};