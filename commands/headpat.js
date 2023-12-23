import { EmbedBuilder } from 'discord.js';
import CommandHandler from './Infrastructure/CommandHandler.js';
import { readdir } from 'fs';

const dir = '../assets/headpat';

async function run(client, message, args)
{
  readdir(dir, (err, files,) => {
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
        else if (usernames.length > 1) return message.channel.send("Too many results! ("+ usernames.length +")")
        else {
          guild.members.cache.forEach(member => {
            if (member.displayName.toLowerCase().includes(args[0].toLowerCase())) {
              usernames.push(member.user.username);
            }
          });
          if (usernames.length == 1) name = usernames[0]; 
          else if (usernames.length > 1) return message.channel.send("Too many results! ("+ usernames.length +")") 
          else return message.channel.send("No Users found!")
        }
      }
      else {
        name = mention.username
      }
      let embd = new EmbedBuilder()
        .setTitle((name===message.author.username)? `${message.author.username} headpats themself`:`${message.author.username} headpats ${name}`)
        .setDescription(lib.randMessage(["Headpats!","*pat pat*","You tried!"]))
        .setColor(colors.purple)
        .setImage(`attachment://${random}.gif`)
      message.channel.send({
        embeds: [embd],
        files: [{
          attachment: `./assets/headpat/${random}.gif`,
          name: `${random}.gif`
        }]
      });
      }
    else message.reply('Type !headpat @user')
  });
}

const config = {
  name: 'headpat',
  aliases: ['headpats', 'pat']
};

export default new CommandHandler(config.name, config.aliases, run);