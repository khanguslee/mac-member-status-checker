import express from 'express';
import member from '../controllers/member';

const memberRouter = express.Router();

memberRouter.post('/add', member.add);
memberRouter.post('/valid', member.validate);

module.exports = memberRouter;
