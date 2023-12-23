import fs from 'fs';
import {IDs} from '../ids_manager.js';
import lib from '../util/lib.js';
import colors from '../util/colors.js';
import { EmbedBuilder, Message } from 'discord.js';
import CommandHandler from './Infrastructure/CommandHandler.js';
import ServiceClient from '../ServiceClient.js';

const dir = './assets/hug';

async function run(client: ServiceClient, message: Message, args: string[]): Promise<void>
{
  var name;
  fs.readdir(dir, (err, files,) => {
    if (message.content.split(' ').length === 2) 
    {
      var random = Math.floor(Math.random() * files.length)+1;
      let mention = message.mentions.users.first();

      if(typeof mention ==='undefined') 
      {
        // Try to find user by username
        let usernames = [];
        message.guild.members.cache.forEach(member => 
        {
          if (member.user.username.toLowerCase().includes(args[0].toLowerCase())) {
            usernames.push(member.user.username);
          }
        }); 

        if (usernames.length == 1) 
        {
          name = usernames[0]; 
        }
        else if (usernames.length > 1) 
        {
          return message.channel.send("Too many results! ("+ usernames.length +")");
        }
        else {
          // Try to find user by display name
          message.guild.members.cache.forEach(member => 
          {
            if (member.displayName.toLowerCase().includes(args[0].toLowerCase())) {
              usernames.push(member.user.username);
            }
          });
          if (usernames.length == 1) 
          {
            name = usernames[0]; 
          }
          else if (usernames.length > 1) 
          {
            message.channel.send("Too many results! ("+ usernames.length +")");
            return
          }
          else 
          {
            message.channel.send("No Users found!");
            return
          }
        }
      }
      else 
      {
        name = mention.username;
      }

      let embd = new EmbedBuilder()
        .setTitle((name===message.author.username)? `${message.author.username} hugs themself`:`${message.author.username} hugs ${name}`)
        .setDescription(lib.randMessage(["A wild hug appeared!","You are now my hostage.","*Squish*"]).toString())
        .setColor(colors.purple)
        .setImage(`attachment://${random}.gif`);
      message.channel.send({
        embeds: [embd],
        files: [{
          attachment: `./assets/hug/${random}.gif`,
          name: `${random}.gif`
        }]
      });
    }
    else 
    {
      message.reply('Type !hug @user');
    }
  });
}

const config = {
  name: 'hug',
  aliases: ['hugs']
};

export default new CommandHandler(config.name, config.aliases, run);