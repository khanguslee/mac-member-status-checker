import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import logger from './logger';

import statusRouter from './routes/status';
import memberRouter from './routes/member';

import verifyGithubPayload from './middlewares/verify_payload';

/* Initialisation */
dotenv.config();

/* Database */
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/MAC';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Server */
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(PORT, () => {
  logger.info(`Server listening at ${server.address().port}`);
});

/* Routes */
app.use('/status', verifyGithubPayload, statusRouter);
app.use('/member', memberRouter);

export default server;
