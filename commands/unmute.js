/*
Allows moderators to unmute any person on the server. 
Removes the role "Temp-mute".
Use by : "!unmute @user"
*/
import lib from "../util/lib.js";
import CommandHandler from "./Infrastructure/CommandHandler.js";

async function run(client, message, args)
{
  if (lib.isModerator(message.member))
  {
    const user = message.guild.member(message.mentions.users.first());
    var role = user.guild.roles.cache.find(role => role.name === "Temp-mute");
    user.roles.remove(role);
    return message.react("✅");
  }
  message.react("❌");
}

const config = {
  name: 'unmute',
  aliases: []
};

export default new CommandHandler(config.name, config.aliases, run);