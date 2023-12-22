import ambush from '../commands/ambush.js';

const files = {ambush: ambush};

export default async (client) => {

    client.commands = new Map();
    client.aliases = new Map();

    var names = [];
    for (const name in files) {
        const cmd = files[name];
        names.push(cmd.config.name)
        client.commands.set(cmd.config.name, cmd); 
        for (const a of cmd.config.aliases) client.aliases.set(a, cmd.config.name);
    } 
    console.log(`Commands loaded: ${names.join(', ')}`);
};