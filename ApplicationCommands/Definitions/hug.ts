import fs from 'fs';
import lib from '../../util/lib.js';
import colors from '../../util/colors.js';
import { ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';
import ServiceClient from '../../ServiceClient.js';
const dir = './assets/hug';

async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction): Promise<void>
{
  fs.readdir(dir, (err, files,) =>
  {
    interaction.reply(GenerateResponse(files, interaction));
  });
}

function GenerateResponse(files: string[], interaction: ChatInputCommandInteraction): InteractionReplyOptions
{
  let user = interaction.options.getUser('user');
  let random = Math.floor(Math.random() * files.length) + 1;
  let embd = new EmbedBuilder()
    .setTitle((user.username === interaction.user.username) ? `${interaction.user.username} hugs themself` : `${interaction.user.username} hugs ${user.username}`)
    .setDescription(lib.randMessage(["A wild hug appeared!", "You are now my hostage.", "*Squish*"]).toString())
    .setColor(colors.purple)
    .setImage(`attachment://${random}.gif`);

  return {
    embeds: [embd],
    files: [{
      attachment: `./assets/hug/${random}.gif`,
      name: `${random}.gif`
    }]
  };
}

const builder = new SlashCommandBuilder()
  .setName("hug")
  .setDescription("Sends a hug to a user")
  .addUserOption(opt => opt
    .setName("user")
    .setDescription("The user to send hugs to")
    .setRequired(true));

export default new ApplicationCommand(builder, execute);