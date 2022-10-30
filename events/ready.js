const {REST, Routes, Events} = require('discord.js');
const keepAlive = require('../server');
const ids = require('../ids_manager');
const lib = require('../util/lib.js');
const fs = require('node:fs');

module.exports = {
    name: Events.ClientReady,
    once: true,
}

module.exports.execute = async (client) => {
    // Grab all the command files from the commands directory you created earlier
    const commandFiles = fs.readdirSync('./commands_ws/').filter(file => file.endsWith('.js'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    commandsJSON = []
    for (const file of commandFiles) {
        const cmd = require(`../commands_ws/${file}`);
        if (!cmd.data.isButton) commandsJSON.push(cmd.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);
    const data = await rest.put(
        Routes.applicationGuildCommands(ids.clientID, ids.serverID),
        { body: commandsJSON },
    );

    console.log(`Uploaded ${data.length} slash commands.`)

    keepAlive();
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(getRandomStatus());
    setInterval(function (){
        client.user.setActivity(getRandomStatus());
    }, 420000);
}

function getRandomStatus() {
    return lib.randMessage(
        [["as imposter",4],
        ["Among Us",4],
        ["in the vents",4],
        ["moderating Cozy Cosmos",2],
        ["Simon Says in Reactor",2],
        ["games to avoid tasks",1.5],
        "with a snowman",
        "with their pet robot",
        "Town of Salem", 
        "Minecraft",
        "League of Legends",
        "suspenseful music",
        ["Pokémon: Shiny Hunting",0.25], 
        ["Pokémon GO",0.25]]
    ) + " | !commands";
}