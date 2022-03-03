const Discord = require('discord.js');
const fs = require('fs');
const dir = './assets/hug';
const lib = require('../util/lib.js');
const colors = require('../util/colors.js');
module.exports.run = async (client, message, args) => {
  fs.readdir(dir, (err, files,) => {
    if (message.content.split(' ').length === 2) {
      var random = Math.floor(Math.random() * files.length)+1;
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
        name = mention.username;
      }
        let embd = new Discord.MessageEmbed()
          .setTitle((name===message.author.username)? `${message.author.username} hugs themself`:`${message.author.username} hugs ${name}`)
          .setDescription(lib.randMessage(["A wild hug appeared!","You are now my hostage.","*Squish*"]))
          .setColor(colors.purple)
          .setImage(`attachment://${random}.gif`);
        message.channel.send({
          embed: embd,
          files: [{
            attachment: `./assets/hug/${random}.gif`,
            name: `${random}.gif`
          }]
        });
      }
    else message.reply('Type !hug @user');
  });
}

module.exports.config = {
  name: 'hug',
  aliases: ['hugs']
};