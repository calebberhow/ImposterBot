import { IDs } from "../ids_manager.js";
import CommandHandler from "./Infrastructure/CommandHandler.js";

async function run(client, message, args)
{
    if (message.channel.id != IDs.oxygen) {
      message.channel.send({text:"This command can only be used in <#" + ids.oxygen + ">!"});
      return;
    }

    message.channel.send({text:"This command will do something in the future!"})
}

const config = {
  name: 'random',
  aliases: []
};

export default new CommandHandler(config.name, config.aliases, run);