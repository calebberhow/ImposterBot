import { IDs } from "../ids_manager.js";
import CommandHandler from "./Infrastructure/CommandHandler.js";

async function run(client, message, args)
{
  message.channel.send(
  `**Function**
  Allows a user to easily make an embed with vast customizability. After embed is sent, the user's command gets deleted.

  **Arguments** (All arguments are optional)
  Note: Parentheses *are* required. Any <> brackets are not.
  Title -- Set title with (title=title goes here)
  Description -- Set description with (description=description goes here)
  Author -- Set author with (authorname=name here) or by an @ mention. @ mentions also pull the user's avatar.
  Avatar -- Set the avatar with (avatarurl=image url goes here) or by an @ mention. @ mentions also pull the user's name.
  Footer -- Set footer text with (footer=footer text goes here)
  FooterImage -- Image left of footer text, set image with (footerimage=url of footer image)
  Image -- Image in body of embed, set image with (image=url of image)
  Thumbnail -- Image to the right of author, title, and description, set image with (thumbnail=url of thumbnail image)
  Color -- Set color of embed with (color=hexcode goes here)
  Channel -- Send embed to specific channel with (channel=channel id goes here). Channel ID must be within this server.
  Timestamp -- Enable timestamp with (timestamp=true)

  **Syntax Example**
  ${IDs.prefix}embed (title=My Embed) (description=My description) (authorName=Cressy) (footer=Goodbye!) (image=https://i.imgur.com/lukpd.jpeg) (color=00008b)

  **Images**
  Images must be sent as a URL. However, many formats are allowed, including (but not limited to):
  - .jpeg
  - .png
  - .gif`);

  embed = new Discord.MessageEmbed()
    .setTitle('Title')
    .setDescription('Description')
    .setFooter('Footer','https://i.imgur.com/lukpdJb.jpeg')
    .setAuthor('AuthorName','https://i.imgur.com/lukpdJb.jpeg')
    .setImage('https://i.imgur.com/lukpdJb.jpeg')
    .setThumbnail('https://i.imgur.com/lukpdJb.jpeg');

  message.channel.send({embeds:[embed]});
}

const config = {
  name: 'embedhelp',
  aliases: ['embdhelp','helpembed']
};

export default new CommandHandler(config.name, config.aliases, run);