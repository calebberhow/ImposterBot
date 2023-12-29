import CommandHandler from "./Infrastructure/CommandHandler.js";

async function run(client, message, args)
{
  if (args[0] == null) args[0] = "20";
  let split = args[0].split('d');
  let size = split[split.length - 1];
  let dice = size.split("+")[0];
  let modifier = size.split("+")[1] ? size.split("+")[1] : 0;
  if (!["4", "6", "8", "10", "12", "20"].includes(dice)) return message.channel.send("Invalid Size. Try ```!roll 20```");
  var random = Math.ceil(Math.random() * dice);
  let embd = new Discord.MessageEmbed()
    .setThumbnail(`attachment://d${dice}_${random}.png`)
    .setAuthor(`${message.member.displayName} rolls 1d${dice}`, message.author.avatarURL())
    .setColor(makeColor(random, dice))
    .setDescription(`${random == 1 ? "Critical **FAIL**" : `It rolled ${random}`}${!modifier ? "" : ` + ${modifier} (${parseInt(random) + parseInt(modifier)})`}!`);
  message.channel.send({
    embed: embd,
    files: [{
      attachment: `./assets/d${dice}/d${dice}-${random}.png`,
      name: `d${dice}_${random}.png`
    }]
  });
}

const config = {
  name: 'roll',
  aliases: ["r"]
};

function makeColor(value, max)
{
  if (value == -1) return [111, 255, 200];
  // value must be between [0, 510]

  let greenValue = Math.min(255 * (value - 1) / (max / 2), 255);
  let redValue = Math.min(255 * (max - value) / (max / 2), 255);

  return [redValue, greenValue, 0];
}

export default new CommandHandler(config.name, config.aliases, run);