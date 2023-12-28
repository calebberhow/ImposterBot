import { Client, ChatInputCommandInteraction, ButtonInteraction } from 'discord.js';

type ApplicationCommandFunction = (client: Client, interaction: ChatInputCommandInteraction | ButtonInteraction) => Promise<void>;

interface Name
{
    name: string;
}

enum CommandType
{
    SlashCommand = 0,
    Button = 1,
}

class ApplicationCommand
{
    data: Name; // SlashCommandBuilder, but only need to know command name
    handler: ApplicationCommandFunction;
    type: CommandType
    constructor(data: Name, handler: ApplicationCommandFunction, type: CommandType = CommandType.SlashCommand)
    {
        this.data = data;
        this.handler = handler;
        this.type = type;
    }
}

export default ApplicationCommand;

export { ApplicationCommand, CommandType };