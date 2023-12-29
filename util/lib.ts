import Discord, { GuildEmoji } from 'discord.js';
import ids from '../ids_manager.js';

/*
 * Picks a string randomly out of a list of strings. Returns that string. Allows for weights to be applied, such that some strings can be picked more often than others. 
 */
function randMessage(messagelist: Array<[string | GuildEmoji, number] | string | GuildEmoji>): string | GuildEmoji
{
  var normalizedMessageList: Array<[string | GuildEmoji, number]> = [];

  for (const message of messagelist) 
  {
    if (!Array.isArray(message)) // checks if message does not have a weight attached
    {
      normalizedMessageList.push([message as string | GuildEmoji, 1]); // attach a base weight of 1.
    }
    else 
    {
      normalizedMessageList.push(message as [string | GuildEmoji, number]);
    }
  }

  var sum: number = 0;
  for (let message of normalizedMessageList)
  {
    sum += message[1] as number;
  }

  var rand = Math.random();
  var condlist = new Array<number>(messagelist.length + 1);
  condlist[0] = 0;
  condlist[messagelist.length] = 1;
  for (var i = 0; i < messagelist.length - 1; i++) 
  {
    condlist[i + 1] = condlist[i] + (normalizedMessageList[i][1] as number) / sum;
  }

  for (i = condlist.length; i >= 0; i--) 
  {
    if (rand > condlist[i]) 
    {
      return normalizedMessageList[i][0];
    }
  }
}

/*
 * Check if the input member class object has role "Moderator".
 * Example: lib.isModerator(message.member)
 */
function isModerator(member: Discord.GuildMember)
{
  if (member.roles.cache.find(r => r.name === "Moderator")) 
  {
    return true;
  }
  else 
  {
    return false;
  }
}


function moderate(message: Discord.Message, test: boolean = false) 
{
  /* Deletes message and warns users for offensive slurs. Sends info about user and message to managerChannel. */
  var managerChannel;
  if (!test) managerChannel = message.guild.channels.cache.get(ids.managerChannelID);
  var reglist = [/\bfag+s*?\b/i, /\bdyke+s?\b/i, /\bf.*ggot+s?.*\bb/i, /\bkys+\b/i, /\bkill.* yourself+.*\b/i, /\bretard+(s+)?.*\b/i, /\bretarded+.*\b/i, /\bn.gger+s.*?\b/i, /\bn.gga+s.*?\b/i, /\bwhore+s?\b/i, /\btranny+\b/i];
  var i;
  for (i = 0; i < reglist.length; i++) 
  {
    if (message.content.match(reglist[i])) 
    {
      if (!test)
      {
        let matched = i + 1;
        message.delete();
        message.member.roles.add(ids.mutedRoleID);
        message.reply("Your message has been deleted. Please check your DMs.");
        message.author.send("Your message has been deleted due to the violation of rule 1. You have also been muted on the server. If this was a mistake, contact a moderator.");
        managerChannel.send(`<@&${ids.managerRoleID}>`);
        managerChannel.send('User "' + message.author.username + '" said a no-no. Regex matched: ' + matched);
        return true;
      }
      else 
      {
        return true;
      }
    }
  }
  return false;
}

export default { moderate, randMessage, isModerator };
export { moderate, randMessage, isModerator };