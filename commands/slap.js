const Discord = require('discord.js')
const fs = require('fs');
const lib = require('../util/lib.js');
const colors = require('../util/colors.js');

module.exports.run = async (client, message, args) => {
  // Check if the user sent 2 words, such as !slap @user
  if (message.content.split(' ').length === 2) {
    var random;
    // Number of gif in which a person slaps themself
    selfSlapNums = [4];
    // If the message does not contain a valid mention, this will fail
    mention = message.mentions.users.first();
    if(typeof mention ==='undefined') {
      let usernames = [];
      const guild = message.guild
      guild.members.cache.forEach(member => {
        console.log(member.user.username)
        if (member.user.username.toLowerCase().includes(args[0].toLowerCase())) {
          usernames.push(member.user.username);
        }
      });
      if (usernames.length == 1) mention_name = usernames[0]; 
      else if (usernames.length > 1) return message.channel.send("Too many results! ("+ usernames.length +")");
      else return message.channel.send("No Users found!");
    }
    else mention_name = mention.username
    // if the user slaps themselves, pull a random gif from selfSlapNums, otherwise pick random gif
    if (mention_name===message.author.username) {
      rand = Math.floor(Math.random() * selfSlapNums.length)
      random = selfSlapNums[rand];
    }
    else {
      const length = fs.readdirSync('./assets/slap/').length
      random = Math.floor(Math.random() * length)+1;
    }
    let embd = new Discord.MessageEmbed()
      .setTitle((mention_name===message.author.username)? `${message.author.username} slaps themself`:`${message.author.username} slaps ${mention_name}`)
      .setDescription(lib.randMessage(["R I P","Bad " + mention_name,"That sounded painful."]))
      .setColor(colors.purple)
      .setImage(`attachment://${random}.gif`);
    message.channel.send({
      embed: embd,
      files: [{
        attachment: `./assets/slap/${random}.gif`,
        name: `${random}.gif`
      }]
    });
  }
  // Sent if the user did not try to mention someone
  else message.reply('Type !slap @user');
}

module.exports.config = {
  name: 'slap',
  aliases: ['slaps']
};