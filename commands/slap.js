const Discord = require('discord.js')
const fs = require('fs');
const lib = require('../util/lib.js');
const dir = './assets/slap';
const colors = require('../util/colors.js');

module.exports.run = async (client, message, args) => {
  fs.readdir(dir, (err, files,) => {
    // Check if the user sent 2 words, such as !slap @user
    if (message.content.split(' ').length === 2) {
      var random;
      // Number of gif in which a person slaps themself
      selfSlapNums = [4];
      // If the message does not contain a valid mention, this will fail
      mention = message.mentions.users.first();
      if(typeof mention ==='undefined') {
        let usernames = [];
        const guild = client.guilds.cache.get("760284692669923339");        
        guild.members.cache.forEach(member => {
            if (member.user.username.toLowerCase().includes(args[0].toLowerCase())) {
              usernames.push(member.user.username);
            }
        }); 
        if (usernames.length == 1) name = usernames[0]; 
        else if (usernames.length > 1) return message.channel.send("Too many results! ("+ usernames.length +")");
        else {
          guild.members.cache.forEach(member => {
            if (member.displayName.toLowerCase().includes(args[0].toLowerCase())) {
              usernames.push(member.user.username);
            }
          });
          if (usernames.length == 1) name = usernames[0]; 
          else if (usernames.length > 1) return message.channel.send("Too many results! ("+ usernames.length +")") ;
          else return message.channel.send("No Users found!");
        }
      }
      else {
        name = mention.username
      }
        // if the user slaps themselves, pull a random gif from selfSlapNums, otherwise pick random gif
        if (name===message.author.username) {
          rand = Math.floor(Math.random() * selfSlapNums.length)
          random = selfSlapNums[rand];
        } 
        else {
          random = Math.floor(Math.random() * files.length)+1;
        }
        let embd = new Discord.MessageEmbed()
          .setTitle((name===message.author.username)? `${message.author.username} slaps themself`:`${message.author.username} slaps ${name}`)
          .setDescription(lib.randMessage(["R I P","Bad " + name,"That sounded painful."]))
          .setColor(colors.purple)
          .setImage(`attachment://${random}.gif`)
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
  });
}

module.exports.config = {
  name: 'slap',
  aliases: ['slaps']
};