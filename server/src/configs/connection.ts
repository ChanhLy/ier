import debug from 'debug';
import mongoose from 'mongoose';
const log = debug('Application');

const uri = process.env.MONGO_URI || 'mongodb://localhost/test';

export const connect = mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: process.env.NODE_ENV === 'development' })
  .then(() => {
    log('Connected to MongoDB ' + uri);
  })
  .catch((error) => {
    log(error);
  });

export const connection = mongoose.connection;
