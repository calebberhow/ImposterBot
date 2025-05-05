
class Ghost
{
  favoriteChannel = ["779456953310642228", "776611595173494804", "812481897343090718", "812504533556527114"][Math.floor(Math.random() * 4)];
  async Process(message)
  {
    if (/\b(give us a sign)|(show yourself)|(do something)\b/i.test(message.content))
    {
      var rand = Math.floor(Math.random() * 10);
      if (rand == 0) message.channel.send("<#779456953310642228>");
      else if (rand == 1)
      {
        const responses = ["cant run", "die die die", "hide"];
        let word = responses[Math.floor(Math.random() * responses.length)];
        return word; // message.js processes this with a communications event.
      }
      else if (rand == 2 || rand == 3)
      {
        var msg = await message.guild.channels.cache.get(this.favoriteChannel).send(`<@${message.author.id}>`);
        await msg.delete();
      }
      else if (rand == 4)
      {
        message.react("👻");
      }
      else if (rand == 5)
      {
        message.react("🔪");
      }
    }
    else if (/\bgive us cheese\b/i.test(message.content))
    {
      message.channel.send("🧀");
    }
    else if (message.channel.id == this.favoriteChannel)
    {
      switch (true)
      {
        case (/\bwhere are you\b/i.test(message.content)):
          message.channel.send(`\`${["BEHIND", "NEXT", "HERE"][Math.floor(Math.random() * 3)]}\``);
          break;
        case /\bhow old are you\b/i.test(message.content):
          message.channel.send(`\`${["OLD", "ADULT", "CHILD"][Math.floor(Math.random() * 3)]}\``);
          break;
        case /\bare you friendly\b/i.test(message.content):
          message.channel.send(`\`${["DEATH", "HURT", "FIGHT"][Math.floor(Math.random() * 3)]}\``);
          break;
      }
    }
  }
}

export default () => new Ghost();
