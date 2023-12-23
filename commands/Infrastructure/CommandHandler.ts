import { Client, Message } from "discord.js";

type CommandHandlerFunction = (client: Client, message: Message, args: Array<string>) => Promise<void>;

class CommandHandler 
{
    commandName:string;
    commandAliases:Array<string>;
    handler:CommandHandlerFunction;
    essential:boolean;
    constructor(commandName:string, commandAliases:Array<string>, handler:CommandHandlerFunction, essential:boolean = false) 
    {
        this.commandName = commandName;
        this.commandAliases = commandAliases;
        this.handler = handler;
        this.essential = essential;
    }
}

export default CommandHandler;
export {CommandHandler, CommandHandlerFunction};