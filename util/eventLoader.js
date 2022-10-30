const requireAll = require('require-all');
const path = require('path');
const fs = require('node:fs');
module.exports = (client) => {
    client.removeAllListeners();
    
    const eventFiles = fs.readdirSync('./events').filter(file => (file.endsWith('.js') && !file.endsWith('.test.js')));
    
    for (const file of eventFiles) {
        const filePath = path.join('../events', file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
    console.log(`Events loaded: ${eventFiles.join(', ')}`);
};

