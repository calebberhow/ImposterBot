import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import colors from '../../util/colors.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';
import ServiceClient from '../../ServiceClient.js';

async function run(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  let ephemeral = interaction.options.getBoolean('ephemeral');
  if (ephemeral == null)
  {
    ephemeral = false;
  }

  var embed = new EmbedBuilder()
    .setTitle('For a custom (unofficial) game mode in Among Us that you can host on this server!')
    .setDescription(
      `**Rules (for crewmates):**
1. Imposter reveals themselves at the beginning of the game.
2. Crewmates **cannot** report bodies or call meetings (unless people are not able to talk or hear who the imposter is through the call), the ONLY way to win is through completing tasks.
3. Imposters can **only** sabotage communications (The WiFi looking symbol), and crewmates may attempt to fix this.
4. Try not to die and hide wherever you can.
5. If you are on a call, there is no need to mute as the imposter is known by everyone.
 
**Game Rules (For hosts):**
Kill cooldown: 10 seconds
Discussion time: 0 seconds
Voting time: 15 seconds
Emergency meetings: 1 (To reveal imposter at the beginning)
Player speed: 3
Crewmate vision: 5x
Imposter vision: 0.25x
Taskbar: Keep viewable so imposter can sabotage comms
Short tasks: 3 (Recommended)`)
    .setColor(colors.royalblue);
  interaction.reply({ embeds: [embed], ephemeral: ephemeral });
}

const builder = new SlashCommandBuilder()
  .setName('hideandseek')
  .setDescription('gets rules of the unofficial hideandseek Among Us gamemode')
  .addBooleanOption(opt => opt
    .setName('ephemeral')
    .setDescription('sets whether the response should be sent in private to only you'));

export default new ApplicationCommand(builder, run);