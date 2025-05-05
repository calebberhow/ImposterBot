import { randMessage } from '../../util/lib.js';
import colors from '../../util/colors.js';
import { ChatInputCommandInteraction, Client, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

async function run(client: Client, interaction: ChatInputCommandInteraction)
{
  let ephemeral = interaction.options.getBoolean('ephemeral');
  if (ephemeral == null)
  {
    ephemeral = false;
  }

  var rand = randMessage(["It's heads.", "It's tails."]).toString();
  var embed = new EmbedBuilder()
    .setTitle('Coin Flip')
    .setDescription(rand)
    .setColor(colors.slate);

  interaction.reply({ embeds: [embed], ephemeral: ephemeral });
};

const builder = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('flips a coin!')
  .addBooleanOption(opt => opt
    .setName('ephemeral')
    .setDescription('sets whether the response should be sent in private to only you'));

export default new ApplicationCommand(builder, run);