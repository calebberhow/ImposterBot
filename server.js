import express from 'express';
import path from 'path';

const server = express();

server.use(express.static(path.resolve('/website')));
server.get('/', (_, res) => res.sendFile("website/index.html"));

function keepAlive() {
  server.listen(3000, () => console.log("Server is Ready!"));
}
export default keepAlive;
