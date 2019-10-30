import express from 'express';
import { checkValidMember } from '../controllers/status';

const statusRouter = express.Router();

statusRouter.post('/valid_member', checkValidMember);

module.exports = statusRouter;
