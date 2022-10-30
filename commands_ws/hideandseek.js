const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const colors = require('../util/colors.js');

const embed = new EmbedBuilder()
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
    .setColor(colors.royalblue)

module.exports.data = new SlashCommandBuilder()
    .setName('hideandseek')
    .setDescription('Privately gives you the rules to the unofficial AmongUs gamemode Hide and Seek.');

module.exports.execute = (interaction) => {
    interaction.reply({ embeds: [embed], ephemeral: true })
}
