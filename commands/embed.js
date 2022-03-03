const Discord = require('discord.js');
module.exports.run = async (client, message) => {
  var args = message.content.split('').slice(7).join('');
  var isTimestamp = false;
  const titlereg = /\(title=.*?\)/i;
  const descreg = /\(description=.*?\)/i;
  const colorreg = /\(color=.*?\)/i;
  const urlreg = /\(url=.*?\)/i;
  const namereg = /\(name=.*?\)/i;
  const avatarurlreg = /\(avatarurl=.*?\)/i;
  const thumbnailreg = /\(thumbnail=.*?\)/i;
  const imagereg = /\(image=.*?\)i/;
  const footerreg = /\(footer=.*?\)/i;
  const footerimagereg = /\(footerimage=.*?\)/i;
  const channelreg = /\(channel=.*?\)/i;
  const timestampreg = /\(timestamp=true\)/i;


  function setVar(reg) {
    if (args.match(reg)) {  
      match = args.match(reg)
      matchchars = match[0].split('');
      return matchchars.slice(reg.toString().length-9, matchchars.length - 1).join('');
    } else return ''
  }
  
  
  var channel = setVar(channelreg)

  if (args.match(timestampreg)) {
    isTimestamp = true;
  }
  
  var embed = new Discord.MessageEmbed()
    .setTitle(setVar(titlereg))
    .setURL(setVar(urlreg))
    .setDescription(setVar(descreg))
    .setColor(setVar(colorreg))
    .setAuthor(setVar(namereg), setVar(avatarurlreg))
    .setThumbnail(setVar(thumbnailreg))
    .setImage(setVar(imagereg))
    .setFooter(setVar(footerreg), setVar(footerimagereg))

  try {
    embed.setAuthor(message.mentions.users.first().username, message.mentions.users.first().displayAvatarURL())
  }
  catch {
    embed.setAuthor(setVar(namereg))
  }

  if (isTimestamp) {
    embed.setTimestamp(new Date())
  }

  if (channel != '') {
    try{
      client.channels.get(channel).send(embed);
      message.delete();
    }
    catch {
      message.channel.send('Send proper channel ID')
    }
  }
  else {
    message.channel.send(embed);
    message.delete();
  }
}

module.exports.config = {
  name: 'embed',
  aliases: ['embd']
};