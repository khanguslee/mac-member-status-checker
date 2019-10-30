import express from 'express';
import status from '../controllers/status';

const statusRouter = express.Router();

statusRouter.post('/valid_member', status.checkValidMember);

module.exports = statusRouter;
