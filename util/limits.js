const Discord = require('discord.js');
ids = require('../ids.json');
const colors = require('./colors.js');

function channel(message, channel)
{
  if (channel == "REACTOR" && message.channel.id != "812481897343090718") return false;
  else if (channel == "OXYGEN" && message.channel.id != "812504533556527114") return false;
  else if (message.channel.id != channel) return false;
  else return true;
}

function user()
{

}

module.exports = { channel, user }

