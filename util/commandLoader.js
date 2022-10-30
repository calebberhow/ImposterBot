const ids = require('../ids_manager');
const fs = require('node:fs');
const { Events } = require('discord.js');

module.exports = async (client) => {
    
/* SKIP NON-SLASH COMMANDS FOR NOW
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
*/

    // // Grab all the command files from the commands directory you created earlier
    // const commandFiles = fs.readdirSync('./commands_ws/').filter(file => file.endsWith('.js'));

    // // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    // commands = []
    // for (const file of commandFiles) {
    //     const cmd = require(`../commands_ws/${file}`);
    //     commands.push(cmd);
    // }

    // // Load Application Commands
    // client.ws.on(Events.InteractionCreate, (interaction) => {
    //     const command = commands.find((cmd) => {
    //         return cmd.data.name.toLowerCase() === interaction.data.name.toLowerCase()
    //     });
    //     command.execute(client, interaction);
    // });
    // console.log(`Loaded ${commands.length} commands: ${commands.map(cmd => cmd.data.name).join(', ')}`);
};