import Events from "../events/Events.js";

export default (client) => {
    client.removeAllListeners();

    var names = [];
    for (const name in Events) {
        const event = Events[name];
        names.push(name);
        client.on(name, event.bind(null,client));
    }
    console.log(`Events loaded: ${names.join(', ')}`);
};

