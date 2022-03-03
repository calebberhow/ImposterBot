const Discord = require('discord.js');
const ids = require('../ids.json');
const colors = require('../util/colors.js')
module.exports.run = async (client, message, args) => {
    if (message.channel.id != ids.oxygen) return message.channel.send("This command can only be used in <#" + ids.oxygen + ">!")
    message.channel.send("This command will do something in the future!")
}

module.exports.config = {
  name: 'random',
  aliases: ['random']
};