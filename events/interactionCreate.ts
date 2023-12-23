import Discord, { ApplicationCommandType, ChatInputCommandInteraction, CommandInteraction, Events, InteractionType } from 'discord.js';
import EventHandler from './Infrastructure/EventHandler.js';
import chalk from 'chalk'
import ServiceClient from '../ServiceClient.js';

function HandleApplicationCommand(client: ServiceClient, interaction: CommandInteraction) : void
{
    switch(interaction.commandType)
    {
        case ApplicationCommandType.ChatInput:
            HandleChatInputCommand(client, interaction as ChatInputCommandInteraction);
            break;
        default:
            console.log(chalk.red(`User attempted to execute an Application Command of type ${chalk.yellow(interaction.commandType)}, but the application does not have support for this interaction.`));
            break;
    }
}

function HandleChatInputCommand(client: ServiceClient, interaction: ChatInputCommandInteraction) : void
{
    const command = client.Services.ApplicationCommands.get(interaction.commandName)
        
    if (command == null)
    {
        console.log(chalk.red(`User attempted to run Application (/) command ${chalk.yellow(interaction.commandName.toLowerCase())} which does not exist.`));
        return;
    }

    var guild: string = interaction.guild.name;
    var channel: string = interaction.channel.name

    console.log(`Executing ${chalk.whiteBright(command.data.name)} Application (/) Command for ${chalk.whiteBright(interaction.user.tag)} (${guild} => ${channel}).`);
    command.handler(client, interaction);
}

async function OnInteractionCreate(client: ServiceClient, interaction: Discord.Interaction)
{
    switch(interaction.type)
    {
        case InteractionType.ApplicationCommand:
            HandleApplicationCommand(client, interaction);
            break;
        default:
            console.log(chalk.red(`User initiated an interaction of type ${chalk.yellow(interaction.type)}, but the application does not have support for this interaction.`));
            break;
    }
}

export default new EventHandler(Events.InteractionCreate, OnInteractionCreate);