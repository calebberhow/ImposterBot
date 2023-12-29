import { EmbedBuilder } from 'discord.js';
import colors from '../util/colors.js';
import CommandHandler from './Infrastructure/CommandHandler.js';

async function run(client, message, args)
{
  var dbObjects = require('../dbObjects.js');
  var userCollection = dbObjects.userCollection;
  embed = new EmbedBuilder()
    .setTitle('Leaderboard')
    .setDescription(userCollection.sort((a, b) => b.balance - a.balance)
      .filter(user => client.users.cache.has(user.user_id))
      .first(10)
      .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance} 🪙`)
      .join('\n'))
    .setColor(colors.slate);
  message.channel.send({ embeds: [embed] });
}

const config = {
  name: 'leaderboard',
  aliases: ['lb']
};

export default new CommandHandler(config.name, config.aliases, run);