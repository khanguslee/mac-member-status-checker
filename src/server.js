import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import status from './routes/status';

dotenv.config();

const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(PORT, () => {
  console.info('Server listening at', server.address().port);
});

/* Routes */
app.use('/status', status);

export default server;
