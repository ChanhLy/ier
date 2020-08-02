import debug from 'debug';
import app from './app';
import { connection } from './configs/connection';

const PORT = process.env.PORT || '3000';

const log = debug('Application');
connection;
const server = app.listen(PORT, () => {
  log('Listening on port ' + PORT);
});

app.on('SIGTERM', () => {
  server.close((err) => log(err));
});
export default server;
