import { EmbedBuilder } from "discord.js";
import CommandHandler from "./Infrastructure/CommandHandler.js";

async function run(client, message, args)
{
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
      { name: 'Required Download', value: `**Minecraft (Java Edition):** Use "!minecraft" to view server information.\n**Among Us:** Use "!host" to host an Among Us lobby. Modded Among Us is currently Steam edition only.\n**League of Legends:** Jungle diff.\n**Town of Salem:** You can play on browser, Steam, or mobile, but it is now pay to play if you didn't have an account before Nov. 2018.`, inline: true }
    );
  message.channel.send(embed);
}

const config = {
  name: 'games',
  aliases: ['multiplayer', 'party', 'game'],
  essential: true
};

export default new CommandHandler(config.name, config.aliases, run, config.essential);