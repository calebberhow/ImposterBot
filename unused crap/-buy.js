const { Op } = require('sequelize');
const { Users, CurrencyShop, UserItems, userCollection } = require('../dbObjects');

module.exports.run = async (client, message, args) => {
  args = args.join(' ')
  const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
  if (!item) return message.channel.send(`That item doesn't exist.`);
  if (item.cost > userCollection.getBalance(message.author.id)) {
    return message.channel.send(`You currently have ${userCollection.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
  }

  const user = await Users.findOne({ where: { user_id: message.author.id } });
  userCollection.add(message.author.id, -item.cost);
  await user.addItem(item);

  message.channel.send(`You've bought: ${item.name}.`);
}

module.exports.config = {
  name: 'buy',
  aliases: []
};