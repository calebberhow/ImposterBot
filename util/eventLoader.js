module.exports = (client) => {
    const requireAll = require('require-all');
    const path = require('path');

    const files = requireAll({
        dirname: path.join(__dirname,'../events'),
        filter: /^(?!-)(.+)(?<!.test)\.js$/
    });

    client.removeAllListeners();
  
    var names = [];
    for (const name in files) {
        const event = files[name];
        names.push(name);
        client.on(name, event.bind(null,client));
    }

    console.log(`Events loaded: ${names.join(', ')}`);
};

