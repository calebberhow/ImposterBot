import chalk from 'chalk'
import { Client, REST, Routes } from 'discord.js';

import { ApplicationCommand, CommandType } from '../ApplicationCommands/Infrastructure/ApplicationCommand.js';
import IDs from '../ids_manager.js';
import say from '../ApplicationCommands/Definitions/say.js';
import say2 from '../ApplicationCommands/Definitions/say2.js';
import { MCStatus,  MCStatus_NextPage,  MCStatus_PrevPage,  MCStatus_Rules } from '../ApplicationCommands/Definitions/mcstatus.js';
import hug from '../ApplicationCommands/Definitions/hug.js';

class ApplicationCommandList
{
    Values:Array<ApplicationCommand>;
    PublishType: PublishType = PublishType.PrivateOnly;
    constructor(...values:Array<ApplicationCommand>)
    {
        this.Values = values;
    }

    get(commandName:string): ApplicationCommand | null
    {
        for (const command of this.Values)
        {
            if (command.data.name.toLocaleLowerCase() == commandName.toLowerCase())
            {
                return command;
            }
        }
        return null;
    }

    async Publish(client: Client) {
        const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);
    
        switch (this.PublishType) {
            case PublishType.PrivateOnly:
                await rest.put(Routes.applicationCommands(client.user.id), { body: []});
                await rest.put(Routes.applicationGuildCommands(client.user.id, IDs.serverID), { body: this.getFormBody() });
                break;
            case PublishType.PublicOnly:
                await rest.put(Routes.applicationCommands(client.user.id), { body: this.getFormBody() });
                await rest.put(Routes.applicationGuildCommands(client.user.id, IDs.serverID), { body: [] });
                break;
            default:
                throw new Error("Invalid Publish Type");
        }
        
        const commands = this.Values.filter(x => x.type == CommandType.SlashCommand);
        console.log(chalk.green(`Published ${chalk.gray(commands.length)} Application (/) Commands: ${commands.map(x => chalk.yellow(x.data.name)).join(", ")}`));
    }

    private getFormBody()
    {
        return this.Values.filter(x => x.type == CommandType.SlashCommand).map(x => x.data);
    }
}

enum PublishType {
    PrivateOnly,
    PublicOnly,
}

export default new ApplicationCommandList(say, say2, MCStatus, MCStatus_Rules, MCStatus_NextPage, MCStatus_PrevPage, hug);
export { ApplicationCommandList, PublishType }