import { connect, connection } from './connection';

export const mochaHooks = {
  async before(): Promise<void> {
    // do something before every test
    await connect;
  },

  async after(): Promise<void> {
    await connection.dropDatabase();
  },
};
