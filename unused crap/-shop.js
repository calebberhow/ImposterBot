const ids = require('../ids.json');
const colors = require('../util/colors.js');
const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
  var dbObjects = require('../dbObjects.js');
  var CurrencyShop = dbObjects.CurrencyShop;
  const coinEmoji = client.emojis.cache.get(ids.coinEmoji)
  const items = await CurrencyShop.findAll();
  let embed = new Discord.MessageEmbed()
    .setTitle('Badge Shop')
    .setColor(colors.slate)
    .setDescription(`${items.map(item => `${client.emojis.cache.get(item.emojiID)} ${item.name}, Price: ${item.cost} ${coinEmoji}`).join('\n')}`);
  return message.channel.send(embed);
}

module.exports.config = {
  name: 'shop',
  aliases: []
};