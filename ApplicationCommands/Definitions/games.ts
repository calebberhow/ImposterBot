import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import colors from "../../util/colors.js";
import ServiceClient from "../../ServiceClient.js";
import ApplicationCommand from "../Infrastructure/ApplicationCommand.js";

async function run(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  let ephemeral = interaction.options.getBoolean('ephemeral');
  if (ephemeral == null)
  {
    ephemeral = false;
  }

  var embed = new EmbedBuilder()
    .setTitle('Here are the commonly played multiplayer games on Cozy Cosmos.')
    .setColor(colors.royalblue)
    .addFields(
      { name: 'Browser', value: `**Gartic Phone:** <https://garticphone.com>\n**Skribbl.io:** <https://skribbl.io>\n**Narwhale.io:** <http://narwhale.io>\n**Wormax.io:** <http://wormax.io>\n**Curve Fever:** <https://curvefever.pro>\n**Jackbox:** <https://jackbox.tv>\n**Splix.io:** <https://splix.io>\n**Scrabble:** <https://www.lexulous.com>\n`, inline: true },
      { name: '∾', value: `Drawing interpretation + Telephone.\nGuess the drawing prompt.\nDefeat the other narwhals.\nMultiplayer slither.io (Defeat snakes)\nPrecise line survival with power-ups.\nMany different games, needs host.\nCapture all the squares.\nUse your tiles to make words.`, inline: true },
      {
        name: '\u200B',
        value: '\u200B',
      },
      { name: 'Required Download', value: `**Minecraft (Java Edition):** Use "/mcinfo" to view server information.\n**Among Us:** Use "!host" to host an Among Us lobby. Modded Among Us is currently Steam edition only.\n**League of Legends:** Jungle diff.\n**Town of Salem:** You can play on browser, Steam, or mobile, but it is now pay to play if you didn't have an account before Nov. 2018.`, inline: true }
    );
  interaction.reply({ embeds: [embed], ephemeral: ephemeral });
}

const builder = new SlashCommandBuilder()
  .setName('games')
  .setDescription('gets info about popular multiplayer/party games!')
  .addBooleanOption(opt => opt
    .setName('ephemeral')
    .setDescription('sets whether the response should be sent in private to only you'));

export default new ApplicationCommand(builder, run);