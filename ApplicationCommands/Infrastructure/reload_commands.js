import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import ApplicationCommands from '../ApplicationCommands.js';
import ids_manager from '../../ids_manager.js';

async function reload(client) {
    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    try {
        console.log('Started refreshing Application (/) Commands.');

        var cmds = [];
        for (const name in ApplicationCommands) {
            cmds.push(ApplicationCommands[name].data);
        }

        // await rest.put(
        //     Routes.applicationCommands(client.user.id), { body: []});
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, ids_manager.IDs.serverID), 
            { body: cmds });
        console.log(`Successfully reloaded  ${cmds.length} Application (/) Commands.`);
    } 
    catch (error) {
        console.error(error);
    }
}

export default reload;