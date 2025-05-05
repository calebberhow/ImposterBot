import { Client } from "discord.js";
import CommandRegistryInstance, { CommandRegistry } from "./Services/CommandList.js";
import EventAggregatorInstance, { EventAggregator } from "./Services/EventCollector.js";
import ApplicationCommandsInsance, { ApplicationCommandList } from './Services/ApplicationCommands.js';
import pgClient from './Services/Database.js';

class ServiceClient extends Client
{
  Services: Services = {
    CommandRegistry: CommandRegistryInstance,
    EventAggregator: EventAggregatorInstance,
    ApplicationCommands: ApplicationCommandsInsance,
    Database: pgClient,
  };
}

interface Services
{
  CommandRegistry: CommandRegistry,
  EventAggregator: EventAggregator,
  ApplicationCommands: ApplicationCommandList,
  Database: any, // pg module has poor typing
}

export default ServiceClient;