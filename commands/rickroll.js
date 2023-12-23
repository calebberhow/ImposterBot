import ytdl from 'ytdl-core';
import CommandHandler from './Infrastructure/CommandHandler.js';
import chalk from 'chalk';

async function run(client, message, args)
{
    if (message.author.id != "642172417417936925" && message.author.id != "318195473364156419") return;
    const channel = client.guilds.cache.get("760284692669923339").channels.cache.get("760284693144272900");
    if (!channel) return console.error("The channel does not exist!");
    channel.join().then(connection => {
        // Yay, it worked!
        if (args == "cancel") return connection.disconnect()
        console.log(chalk.green(`Successfully connected to channel ${chalk.yellow(channel.name)}.`));
        connection.play(ytdl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
        .on("finish", () => {
            connection.disconnect()
        })
    }).catch(e => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
        connection.disconnect()
    });
}

const config = {
  name: 'rickroll',
  aliases: []
};

export default new CommandHandler(config.name, config.aliases, run);