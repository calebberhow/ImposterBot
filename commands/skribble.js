import { EmbedBuilder } from 'discord.js';
import { IDs } from '../ids_manager.js';
import colors from '../util/colors.js';
import CommandHandler from './Infrastructure/CommandHandler.js';
import coinflip from './coinflip.js';

async function run(client, message, args)
{
  var activegames;
  if (message.guild.id === IDs.cozycosmos) activegames = message.guild.channels.cache.get(IDs.activegamesChannelID);
  else activegames = message.channel;

  // Checks to see if !host and 4 arguments have been passed. If so, host game
  if (message.content.split(' ').length == 2)
  {
    link = message.content.split(' ')[1];
    sendSkribbleEmbed(message, link, activegames);
  }

  // Otherwise, allow for arguments to be passed after !host has been sent.
  else
  {
    message.reply('please send your skribbl.io join link after this message. \n**Once the game is started, react to the active game embed with a :x: reaction.**');
    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 75000 }).then(collected =>
    {
      sendSkribbleEmbed(message, collected.first().content, activegames);
    }).catch(() =>
    {
      message.channel.send('It appears there is an error or timeout, please try again. If this continues, please ping admin.');
    });
  }
}


function sendSkribbleEmbed(message, link, activegames)
{
  if (link.startsWith('https://'))
  {
    var embed = new EmbedBuilder()
      .setTitle('Skribbl.io')
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setDescription(`This is an active Skribbl.io game hosted by ${message.author.username}! Click the embed link to join!`)
      .setTimestamp(new Date())
      .setThumbnail('https://i.imgur.com/17BTKK8.png')
      .setColor(colors.purple)
      .addField('Link:', `${link}`);
    // Sends the embed with game information to the active games channel
    activegames.send(embed);
    // Pings the lobby pings role
    if (message.guild.id === IDs.cozycosmos) activegames.send(`<@&${IDs.otherpartygamesRoleID}>`);
    message.channel.send('The active games channel has been pinged!');
  }
  else
  {
    message.reply('Format link like this: <https://skribbl.io/>');
  }
}

const config = {
  name: 'skribble',
  aliases: [],
  essential: true
};

export default new CommandHandler(config.name, config.aliases, run, config.essential);