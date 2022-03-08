ids = require('../ids_manager');

const spamSettings = {
    warnThreshold: 4, muteThreshold: 6, kickThreshold: 15, banThreshold: 20,
    maxDuplicatesWarning: 3, maxDuplicatesMute: 5, maxDuplicatesKick: 7, maxDuplicatesBan: 12,
    maxInterval: 3000, maxDuplicatesInterval: 4000,
    warnMessage: '{@user}, Please stop spamming.',
    kickMessage: 'We warned **{user_tag}**... Now they have been kicked for spamming.',
    muteMessage: '**{user_tag}** has been muted for spamming.',
    banMessage: '**{user_tag}** has been banned for spamming.',
    ignoreBots: true,
    muteRoleName: "Temp-mute",
    removeMessages: true,
    warnErrorMessage: 'Could not warn **{user_tag}** because of improper permissions.',
    muteErrorMessage: 'Could not mute **{user_tag}** because of improper permissions.',
    kickErrorMessage: 'Could not kick **{user_tag}** because of improper permissions.',
    banErrorMessage: 'Could not ban **{user_tag}** because of improper permissions.',
    deleteMessagesAfterBanForPastDays: 1,
}

function randMessage(messagelist, weightlist = 'undefined', test=false) {
    if (weightlist === 'undefined') { // Pure random:
        return messagelist[Math.floor(Math.random() * messagelist.length)];
    }
    else if (messagelist.length === weightlist.length) { // Weighted random:
        sum = 0;
        weightlist.forEach(weight => { sum += weight });
        rand = Math.random()
        condlist = new Array(weightlist.length + 1);
        condlist[0] = 0
        for (i = 0; i < weightlist.length; i++) {
            condlist[i + 1] = condlist[i] + weightlist[i] / sum
        }
        for (i = condlist.length; i >= 0; i--) {
            if (rand > condlist[i]) {
                return messagelist[i]
            }
        }
    }
    else throw new Error('Messagelist (' + messagelist.length + ') and weightlist (' + weightlist.length + ') have different lengths.');
}

/*
Check if the input member class object has role "Moderator".
Example: lib.isModerator(message.member)
*/
function isModerator(member) {
    if (member.roles.cache.find(r => r.name === "Moderator")) {
        return true
    }
    else {
        return false
    }
}


function moderate(message, test=false) {
    /*
    Deletes and warns users for offensive slurs. Sends info about user and message to managerChannel.
    */
    var managerChannel;
    if (!test) managerChannel = message.guild.channels.cache.get(ids.managerChannelID);
    // list of offensive words in regex form
    var reglist = [/\bfag+s*?\b/i, /\bdyke+s?\b/i, /\bf.*ggot+s?.*\bb/i, /\bkys+\b/i, /\bkill.* yourself+.*\b/i, /\bretard+(s+)?.*\b/i, /\bretarded+.*\b/i, /\bn.gger+s.*?\b/i, /\bn.gga+s.*?\b/i, /\bwhore+s?\b/i, /\btranny+\b/i];
    var i;
    for (i = 0; i < reglist.length; i++) {
        if (message.content.match(reglist[i])) {
            if (!test) {
                matched(i, message);
                return true
            }
            else {
                return true
            }
        }
    }
    return false
}

function matched(i, message) {
    matched = i + 1;
    message.delete();
    message.member.roles.add(ids.mutedRoleID);
    message.reply("Your message has been deleted. Please check your DMs.");
    message.author.send("Your message has been deleted due to the violation of rule 1. You have also been muted on the server. If this was a mistake, contact a moderator.");
    managerChannel.send(`<@&${ids.managerRoleID}>`);
    managerChannel.send('User "' + message.author.username + '" said a no-no. Regex matched: ' + matched);
}


module.exports = { moderate, spamSettings, randMessage, isModerator }