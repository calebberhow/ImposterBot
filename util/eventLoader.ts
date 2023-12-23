import Events from '../events/Infrastructure/Events.js';
import ServiceClient from '../ServiceClient.js';
import chalk from 'chalk';

export default (client: ServiceClient) => {
    client.removeAllListeners();

    for (const event of Events) {
        client.on(event.eventName, event.handler.bind(null,client));
    }
    
    console.log(chalk.green(`Loaded ${chalk.gray(Events.length)} events: ${Events.map(x => chalk.yellow(x.eventName)).join(', ')}`));
};
