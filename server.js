const express = require('express');
const server = express();

server.use(express.static(__dirname + '/website'));
server.get('/', (_, res) => res.sendFile("website/index.html"));

function keepAlive() {
  server.listen(3000, () => console.log("Server is Ready!"));
}
module.exports = keepAlive;
