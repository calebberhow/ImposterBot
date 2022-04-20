const Discord = require('discord.js');
const colors = require('../util/colors.js')
module.exports.run = async (client, message, args) => {
   var ms = require('minestat');
    ms.init('98.232.19.144', 25565, function(result){
        message.channel.send(generateMinecraftEmbed(ms))
    })
    delete require.cache[require.resolve('minestat')]
}


function generateMinecraftEmbed(server){
    try {
    return { embed: new Discord.MessageEmbed()
    .setTitle('Cozy Cosmos Minecraft Server')
    .setDescription('Our minecraft server is a place to have fun and hang out with others from the server.')
    .addFields(
        {name: 'Rules', value:"- No exploitation or cheating (x-ray hacking, structure locaters, etc)\n- Don't steal others' things.\n- No griefing.\n- Be friendly.\n- All other server <#760315154864406528> apply"},
        {name: 'Server Rotation Schedule', value:`Mon: Creative\nTues: Survival\nWed: Creative\nThurs: Survival\nFri: Modded 1.12.2\nSat: Modded 1.12.2\nSun: Modded 1.12.2`},
        {name: 'Server Info', value: `Server Address: **${server.address}:${server.port}**\nMinecraft Java Edition \nVersion: ${(server.version == "1.18.1" || server.version == undefined) ? "1.18.1 (No mods)" : server.version}`},
        {name:`\u200B`, value:`[Cozy Cosmos Mod List](https://docs.google.com/document/d/1OTxiLErHDy60BOdtrHpovERnqeUXyaKX-DFyolJ86ks/edit#)`,inline:true},
        {name:`\u200B`,value:`[Mods Download](https://www.dropbox.com/s/med91mwfz2z8ggf/Cozy%20Cosmos%20Modded%20Server%20Setup%20%28mar.%20update%29.rar?dl=0)`, inline: true})
    .setTimestamp(new Date())
    .setThumbnail('https://i.imgur.com/LmKJGGA.png')
    .setColor(server.online? colors.lime:colors.red)
    .setFooter(server.online? 'The server is online!':'The server is offline.',server.online?'https://i.imgur.com/zk3iDa0.png':'https://i.imgur.com/ffZCIGp.png'),
     };
    } catch (err) {console.log(err)}
}
module.exports.config = {
  name: 'minecraft',
  aliases: []
};