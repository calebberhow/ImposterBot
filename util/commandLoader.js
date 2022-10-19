const requireAll = require('require-all');
const path = require('path');
const ids = require('../ids_manager');

module.exports = async (client) => {

    const files = requireAll({
        dirname: path.join(__dirname, '../commands'),
        filter: /^(?!-)(.+)(?<!.test)\.js$/
    });
    const skipped = requireAll({
        dirname: path.join(__dirname, '../commands'),
        filter: /^-.+\.js$/
    });

    client.commands = new Map();
    client.aliases = new Map();

    var skippednames = [];
    for (const name in skipped) {
        cmd = skipped[name];
        skippednames.push(cmd.config.name)
    }
    console.log(`Commands skipped: ${(skippednames === []) ? 'None' : skippednames.join(', ')}`);

    var names = [];
    for (const name in files) {
        const cmd = files[name];
        names.push(cmd.config.name)
        client.commands.set(cmd.config.name, cmd); 
        for (const a of cmd.config.aliases) client.aliases.set(a, cmd.config.name);
    } 
    console.log(`Commands loaded: ${names.join(', ')}`);


    const ws_commands = requireAll({
        dirname: path.join(__dirname, '../commands_ws'),
        filter: /^(?!-)(.+)(?<!.test)\.js$/
    });
    var cmds = [];
    for (const name in ws_commands) {
        cmds.push(ws_commands[name]);
    }

    // Load Application Commands
    client.ws.on("INTERACTION_CREATE", (interaction) => {
        // console.log('interaction!', interaction)
        const command = cmds.find(
            (cmd) => cmd.name.toLowerCase() === interaction.data.name.toLowerCase(),
        );
        // console.log(command)
        command.execute(client, interaction, interaction.data.options);
    });
};