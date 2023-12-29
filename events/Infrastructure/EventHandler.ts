import { Client, ClientEvents } from "discord.js";
import ServiceClient from "../../ServiceClient.js";

// Typing this way ensures that the arguments of the handler are correct for the given event type.
class EventHandler<Event extends keyof ClientEvents>{
  eventName: Event;
  handler: (Client: ServiceClient, ...args: ClientEvents[Event]) => Promise<void>;
  constructor(eventName: Event, handler: (Client: Client, ...args: ClientEvents[Event]) => Promise<void>)
  {
    this.eventName = eventName;
    this.handler = handler;
  }
}

export default EventHandler;