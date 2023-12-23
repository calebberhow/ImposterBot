import { ClientEvents } from 'discord.js';

import guildMemberAdd from '../guildMemberAdd.js';
import guildMemberRemove from '../guildMemberRemove.js';
import message from '../message.js';
import messageUpdate from '../messageUpdate.js';
import ready from '../ready.js';
import interactionCreate from '../interactionCreate.js';
import EventHandler from './EventHandler.js';

const EventHandlers: Array<EventHandler<keyof ClientEvents>> = [ 
    ready,
    message,
    messageUpdate,
    guildMemberAdd,
    guildMemberRemove,
    interactionCreate,
]

export default EventHandlers;
