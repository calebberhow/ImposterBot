import { EmbedBuilder } from "discord.js";
import colors from "../util/colors.js";
import CommandHandler from "./Infrastructure/CommandHandler.js";

async function run(client, message, args)
{
  message.channel.send({ embeds: [generateMinecraftEmbed()] });
}

function generateMinecraftEmbed()
{
  return new EmbedBuilder()
    .setTitle('Cozy Cosmos Minecraft Server')
    .setDescription('Our minecraft servers are a place to have fun and hang out with others from the server.')
    .addFields(
      { name: 'Rules', value: "- No exploitation or cheating (x-ray hacking, structure locaters, etc)\n- Don't steal others' things.\n- No griefing.\n- Be friendly.\n- All other server <#760315154864406528> apply" },
      { name: 'Server Info', value: `Server Address: **CozyCosmos.webredirect.org** (Survival)\n\nTo access our creative or modded servers,\nappend :25566 or :25567 respectively to the  address.\n\nMinecraft Java Edition \nVersion: 1.18.1 (Survival and Creative), 1.12 (Modded)` },
      { name: `\u200B`, value: `[Cozy Cosmos Mod List](https://docs.google.com/document/d/1OTxiLErHDy60BOdtrHpovERnqeUXyaKX-DFyolJ86ks/edit#)`, inline: true },
      { name: `\u200B`, value: `[Mods Download](https://www.dropbox.com/s/med91mwfz2z8ggf/Cozy%20Cosmos%20Modded%20Server%20Setup%20%28mar.%20update%29.rar?dl=0)`, inline: true })
    .setTimestamp(new Date())
    .setThumbnail('https://i.imgur.com/LmKJGGA.png')
    .setColor(colors.lime)
    .setFooter({ text: 'The server is online!', iconURL: 'https://i.imgur.com/zk3iDa0.png' });
}

const config = {
  name: 'minecraft',
  aliases: []
};

export default new CommandHandler(config.name, config.aliases, run);