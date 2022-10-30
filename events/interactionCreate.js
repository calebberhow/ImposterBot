const {Events} = require('discord.js');
const fs = require('node:fs');

const commandFiles = fs.readdirSync('./commands_ws/').filter(file => file.endsWith('.js'));
var commands = [];
for (const file of commandFiles) {
    const cmd = require(`../commands_ws/${file}`);
    commands.push(cmd);
}

module.exports = {
    name: Events.InteractionCreate,
    once: false,
};

module.exports.execute = (client, interaction) => {
    if (interaction.isButton()) {
        const cmd = commands.find(c => c.name === interaction.customId);
        cmd.execute(client, interaction);
    }
    else {
        const command = commands.find((cmd) => {
            return cmd.data.name.toLowerCase() === interaction.commandName.toLowerCase();
        });

        // These commands are async, but we don't have to await their completion before continuing.
        command.execute(client, interaction);
    }
};
