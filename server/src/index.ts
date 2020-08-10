import debug from 'debug';
import http from 'http';
import io from 'socket.io';
import app from './app';
import { connection } from './configs/connection';

const PORT = process.env.PORT || '3000';

const log = debug('Application');
connection;

const server = http.createServer(app.callback());

server.listen(PORT, () => {
  log('Listening on port ' + PORT);
});

export const socket = io(server);

socket.on('connection', (socket) => {
  log('Socket Connected');
});

app.on('SIGTERM', () => {
  server.close((err) => log(err));
});

export default server;
