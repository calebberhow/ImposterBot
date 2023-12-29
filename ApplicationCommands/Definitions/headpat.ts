import { ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder } from 'discord.js';
import { readdir } from 'fs';
import ServiceClient from '../../ServiceClient.js';
import colors from '../../util/colors.js';
import lib from '../../util/lib.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

const dir = './assets/headpat';
const userParameter = 'user';
async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  readdir(dir, (err, files,) =>
  {
    interaction.reply(GenerateResponse(files, interaction));
  });
}

function GenerateResponse(files: string[], interaction: ChatInputCommandInteraction): InteractionReplyOptions
{
  var random = Math.floor(Math.random() * files.length) + 1;
  let user = interaction.options.getUser(userParameter);
  let embd = new EmbedBuilder()
    .setTitle((user.username == interaction.user.username) ? `${interaction.user.username} headpats themself` : `${interaction.user.username} headpats ${user.username}`)
    .setDescription(lib.randMessage(["Headpats!", "*pat pat*", "You tried!"]).toString())
    .setColor(colors.purple)
    .setImage(`attachment://${random}.gif`);

  return {
    embeds: [embd],
    files: [{
      attachment: `./assets/headpat/${random}.gif`,
      name: `${random}.gif`
    }]
  };
}

const builder = new SlashCommandBuilder()
  .setName('headpat')
  .setDescription('headpat another user')
  .addUserOption(opt => opt
    .setName(userParameter)
    .setDescription('sets the user to headpat.')
    .setRequired(true));

export default new ApplicationCommand(builder, execute);