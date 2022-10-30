const { Events, Iteraction } = require('discord.js');
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
    switch(true) {
        case interaction.isCommand():
            console.log(`Executing slash command: ${interaction.commandName} for ${interaction.user.username}`)
            var cmd = commands.find(c => c.data.name === interaction.commandName)
            if (cmd) cmd.execute(interaction);
            break;
        case interaction.isButton():
            var cmd = commands.find(c => c.data.name === interaction.customId)
            if (cmd) cmd.execute(interaction);
            break;
        case interaction.isAutocomplete():
            throw new Error("Autocomplete interactions not implemented")
        case interaction.isChatInputCommand():
            throw new Error("ChatInputCommand interactions not implemented");
        case interaction.isContextMenuCommand():
            throw new Error("ContextMenuCommand interactions not implemented");
        case interaction.isMessageComponent():
            throw new Error("MessageComponent interactions not implemented");
        case interaction.isMessageContextMenuCommand():
            throw new Error("MessageContextMenuCommand interactions not implemented");
        case interaction.isModalSubmit():
            throw new Error("ModalSubmit interactions not implemented");
        case interaction.isSelectMenu():
            throw new Error("SelectMenu interactions not implemented");
        case interaction.isUserContextMenuCommand():
            throw new Error("UserContextMenuCommand interactions not implemented");
    }
};
