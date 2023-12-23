import { Client, EmbedBuilder, Message } from "discord.js";
import CommandHandler from "./Infrastructure/CommandHandler.js";
import colors from "../util/colors.js";

async function run(client: Client, message: Message, args: string[])
{
  var embed = new EmbedBuilder()
    .setTitle('Here is the Ambush guidebook:')
    .setDescription(`<https://docs.google.com/document/d/1btav7j5xaBKcU1fPQ4i5FyV-GWtneFKixsJLblpX7UE/edit?usp=sharing>`)
    .setColor(colors.orange)
    .setFooter({text:"If the !ambush command is broken, please contact @Cressy#4851 or @Khazaari#1515."})
  message.channel.send({embeds:[embed]});
}

const config = {
  name: 'ambushwiki',
  aliases: ['ambushhelp', 'ambushcommands']
};

export default new CommandHandler(config.name, config.aliases, run);