import { Colors, EmbedBuilder, HexColorString } from "discord.js";
import CommandHandler from "./Infrastructure/CommandHandler.js";

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

function setVar(reg: RegExp, args: string) {
  if (args.match(reg)) 
  {  
    let match = args.match(reg)
    let matchchars = match[0].split('');
    return matchchars.slice(reg.toString().length-9, matchchars.length - 1).join('');
  } 
  else 
  {
    return '';
  }
}

async function run(client, message)
{
  var args: string = message.content.split('').slice(7).join('');
  var isTimestamp = false;
  
  var channel = setVar(channelreg, args)

  if (args.match(timestampreg)) {
    isTimestamp = true;
  }
  

  var embed = new EmbedBuilder()
    .setTitle(setVar(titlereg, args))
    .setURL(setVar(urlreg, args))
    .setDescription(setVar(descreg, args))
    .setColor(setVar(colorreg, args) as HexColorString)
    .setAuthor({name:setVar(namereg, args), url:setVar(avatarurlreg, args)})
    .setThumbnail(setVar(thumbnailreg, args))
    .setImage(setVar(imagereg, args))
    .setFooter({text: setVar(footerreg, args), iconURL:setVar(footerimagereg, args)})

  try {
    embed.setAuthor({ name: message.mentions.users.first().username, iconURL: message.mentions.users.first().displayAvatarURL()})
  }
  catch {
    //embed.setAuthor(setVar(namereg, args))
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

const config = {
  name: 'embed',
  aliases: ['embd']
};

export default new CommandHandler(config.name, config.aliases, run);