const requireAll = require('require-all');
const path = require('path');

module.exports = (client) => {
    client.removeAllListeners();
    
    const files_events = requireAll({
        dirname: path.join(__dirname,'../events'),
        filter: /^(?!-)(.+)(?<!.test)\.js$/
    });

    var names = [];
    for (const name in files_events) {
        const event = files_events[name];
        names.push(name);
        client.on(name, event.bind(null,client));
    }
    console.log(`Events loaded: ${names.join(', ')}`);
};

