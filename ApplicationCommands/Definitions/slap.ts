import fs from 'fs';
import colors from '../../util/colors.js';
import lib from '../../util/lib.js';
import { ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions, SlashCommandBooleanOption, SlashCommandBuilder } from 'discord.js';
import ServiceClient from '../../ServiceClient.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction) : Promise<void>
{
    await interaction.reply(GenerateResponse(interaction));
}

function GenerateResponse(interaction: ChatInputCommandInteraction): InteractionReplyOptions
{
    let user = interaction.options.getUser('user');
    const selfSlapNums = ['4'];
    let slapGif: string;

    if (user.username===interaction.user.username) {
      slapGif = selfSlapNums[Math.floor(Math.random() * selfSlapNums.length)];
    }
    else {
      const length = fs.readdirSync('./assets/slap/').length
      slapGif = (Math.floor(Math.random() * length)+1).toString();
    }

    let embd = new EmbedBuilder()
      .setTitle((user.username===interaction.user.username)? `${interaction.user.username} slaps themself`:`${interaction.user.username} slaps ${user.username}`)
      .setDescription(lib.randMessage(["R I P",`Bad ${user.username}`,"That sounded painful."]).toString())
      .setColor(colors.purple)
      .setImage(`attachment://${slapGif}.gif`);

    return {
      embeds: [embd],
      files: [{
        attachment: `./assets/slap/${slapGif}.gif`,
        name: `${slapGif}.gif`
      }]
    };
}

const builder = new SlashCommandBuilder()
    .setName('slap')
    .setDescription('slap another user')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('the user to slap')
        .setRequired(true));

export default new ApplicationCommand(builder, execute);