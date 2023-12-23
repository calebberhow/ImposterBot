import { SharedNameAndDescription, Client, ChatInputCommandInteraction } from 'discord.js';

type ApplicationCommandFunction = (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>;

class ApplicationCommand
{
    data: SharedNameAndDescription; // SlashCommandBuilder, but only need to know command name
    handler: ApplicationCommandFunction;
    constructor(data: SharedNameAndDescription, handler: ApplicationCommandFunction)
    {
        this.data = data;
        this.handler = handler;
    }
}

export default ApplicationCommand;