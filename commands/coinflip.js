const lib = require('../util/lib.js');
const colors = require('../util/colors.js');

module.exports.run = async (client, message, args) => {
  const Discord = require('discord.js');

  //Coinflip "command"
  var rand = lib.randMessage(["It's heads.", "It's tails."])
  var embed = new Discord.MessageEmbed()
    .setTitle('Coin Flip')
    .setDescription(rand)
    .setColor(colors.slate)

  message.channel.send(embed);
};

module.exports.config = {
  name: 'coinflip',
  aliases: ['flipcoin', 'cf']
};