import { Client, EmbedBuilder, Message } from 'discord.js';
import { IDs } from '../ids_manager.js';
import colors from '../util/colors.js';
import CommandHandler from './Infrastructure/CommandHandler.js';

async function run(client: Client, message: Message, args)
{
  var embed = new EmbedBuilder()
    .setTitle('Here are the commands. Also, check out the Cozy Cosmos website at: https://imposterbot.cressykitr.repl.co')
    .setColor(colors.purple)
    .addFields([
      { name: 'Fun', value: `**${IDs.prefix}coinflip:** Flips a coin to get heads or tails.\n**${IDs.prefix}ambush:** Starts an "ambush" game if you tag a user.\n**${IDs.prefix}ambushwiki:** Sends a link of the rules and guide book for the "Ambush" command.\n`, inline: true },
      { name: 'Utility', value: `**${IDs.prefix}host:** Use this command to host an Among Us game and ping the lobby-pings role in the #active-games channel.\n**${IDs.prefix}skribble:** Use this command to host a Skribbl.io game and ping the other-games role in the #active-games channel.\n`, inline: true }
    ]);

  message.channel.isTextBased();
  {
    message.channel.send({ embeds: [embed] });
  }
}

const config = {
  name: 'commands',
  aliases: ['help'],
  essential: true
};

export default new CommandHandler(config.name, config.aliases, run, config.essential);