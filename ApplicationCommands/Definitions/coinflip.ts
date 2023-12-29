import { randMessage } from '../../util/lib.js';
import colors from '../../util/colors.js';
import { ChatInputCommandInteraction, Client, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

async function run(client: Client, interaction: ChatInputCommandInteraction)
{
  var rand = randMessage(["It's heads.", "It's tails."]).toString();
  var embed = new EmbedBuilder()
    .setTitle('Coin Flip')
    .setDescription(rand)
    .setColor(colors.slate);

  interaction.reply({ embeds: [embed] });
};

const builder = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('flips a coin!');

export default new ApplicationCommand(builder, run);