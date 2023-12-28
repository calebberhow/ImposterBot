import CommandHandler from "../commands/Infrastructure/CommandHandler.js";
import chalk from 'chalk';

import ambush from "../commands/ambush.js";
import ambushwiki from "../commands/ambushwiki.js";
import blackjack from "../commands/blackjack.js";
import bored from "../commands/bored.js";
import coinflip from "../commands/coinflip.js";
import embed from "../commands/embed.js";
import embedhelp from "../commands/embedhelp.js";
import games from "../commands/games.js";
import help from "../commands/help.js";
import hideandseek from "../commands/hideandseek.js";
import host from "../commands/host.js";
import leaderboard from "../commands/leaderboard.js";
import minecraft from "../commands/minecraft.js";
import mute from "../commands/mute.js";
import random from "../commands/random.js";
import rickroll from "../commands/rickroll.js";
import roll from "../commands/roll.js";
import skribble from "../commands/skribble.js";
import stab from "../commands/stab.js";
import unmute from "../commands/unmute.js";

class CommandRegistry 
{
    commands:Array<CommandHandler>;
    constructor(...commands:Array<CommandHandler>) 
    {
        console.log(chalk.green(`Loaded ${chalk.gray(commands.length)} chat commands: ${commands.map(x => chalk.yellow(x.commandName)).join(", ")}`));
        this.commands = commands;
    }

    get(commandName:string): CommandHandler | null
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
    ambush,
    ambushwiki,
    blackjack,
    bored,
    coinflip,
    embed,
    embedhelp,
    games,
    help,
    hideandseek,
    host,
    leaderboard,
    minecraft,
    mute,
    random,
    rickroll,
    roll,
    skribble,
    stab,
    unmute);

export { CommandRegistry };