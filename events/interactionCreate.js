import ApplicationCommands from "../ApplicationCommands/ApplicationCommands.js";

var cmds = [];
for (const name in ApplicationCommands) {
    cmds.push(ApplicationCommands[name]);
}

export default (client, interaction) => {
    const command = cmds.find(
        (cmd) => cmd.data.name.toLowerCase() === interaction.commandName.toLowerCase(),
    );

    if (command == undefined)
    {
        console.log(`User attempted to run Application (/) command ${interaction.commandName.toLowerCase()} which does not exist.`);
    }
    else {
        command.execute(client, interaction, interaction.options);
    }
}