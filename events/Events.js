import guildMemberAdd from '../events/guildMemberAdd.js';
import guildMemberRemove from '../events/guildMemberRemove.js';
import message from '../events/message.js';
import messageUpdate from '../events/messageUpdate.js';
import ready from '../events/ready.js';
import interactionCreate from './interactionCreate.js';

export default 
{ 
    guildMemberAdd: guildMemberAdd, 
    guildMemberRemove: guildMemberRemove, 
    message:message, 
    messageUpdate:messageUpdate, 
    ready:ready, 
    interactionCreate:interactionCreate 
};