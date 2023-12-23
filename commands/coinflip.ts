import lib from '../util/lib.js';
import colors from '../util/colors.js';
import { Client, EmbedBuilder, Message } from 'discord.js';
import CommandHandler from './Infrastructure/CommandHandler.js';

async function run(client: Client, message: Message, args: string[])
{
  //Coinflip "command"
  var rand = lib.randMessage(["It's heads.", "It's tails."]).toString()
  var embed = new EmbedBuilder()
    .setTitle('Coin Flip')
    .setDescription(rand)
    .setColor(colors.slate)

  message.channel.send({ embeds: [embed] });
};

const config = {
  name: 'coinflip',
  aliases: ['flipcoin', 'cf']
};

export default new CommandHandler(config.name, config.aliases, run);