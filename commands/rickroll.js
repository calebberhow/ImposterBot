const ytdl = require('ytdl-core');

module.exports.run = async (client, message, args) => {
    if (message.author.id != "642172417417936925" && message.author.id != "318195473364156419") return;
    const channel = client.guilds.cache.get("760284692669923339").channels.cache.get("760284693144272900");
    if (!channel) return console.error("The channel does not exist!");
    channel.join().then(connection => {
        // Yay, it worked!
        if (args == "cancel") return connection.disconnect()
        console.log("Successfully connected.");
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

module.exports.config = {
  name: 'rickroll',
  aliases: []
};