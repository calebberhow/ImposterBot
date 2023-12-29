import CommandHandler from "../commands/Infrastructure/CommandHandler.js";
import chalk from 'chalk';

import bored from "../commands/bored.js";
import help from "../commands/help.js";
import host from "../commands/host.js";
import skribble from "../commands/skribble.js";

class CommandRegistry 
{
  commands: Array<CommandHandler>;
  constructor(...commands: Array<CommandHandler>) 
  {
    console.log(chalk.green(`Loaded ${chalk.gray(commands.length)} chat commands: ${commands.map(x => chalk.yellow(x.commandName)).join(", ")}`));
    this.commands = commands;
  }

  get(commandName: string): CommandHandler | null
  {
    for (const command of this.commands)
    {
      if (command.commandName == commandName || command.commandAliases.includes(commandName)) 
      {
        return command;
      }
    }
    return null;
  }
}

export default new CommandRegistry(
  bored,
  help,
  host,
  skribble);

export { CommandRegistry };