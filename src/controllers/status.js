import axios from 'axios';

import { validateHandler } from './member';
import logger from './../logger';

const BASE_API_URL = 'https://api.github.com';

exports.checkValidMember = function(req, res) {
  const pullRequestBody = req.body.pull_request;
  const username = pullRequestBody.user.login;
  const commitSHA = pullRequestBody.head.sha;

  const repositoryBody = req.body.repository;
  const repositoryName = repositoryBody.full_name;
  logger.info(`Pull Request opened up by: ${username}`);

  const statusAPIUrl = `${BASE_API_URL}/repos/${repositoryName}/statuses/${commitSHA}?access_token=${process.env.ACCESS_TOKEN}`;
  const contextName = 'MAC-member-checker';
  // Send pending status message to Github
  const pendingMessage = {
    state: 'pending',
    description: 'Checking if you are a MAC member...',
    context: contextName,
  };
  logger.debug(`Sending pending status message to github for ${username}`);
  axios.post(statusAPIUrl, pendingMessage);

  // Connect with database to check if username exists
  validateHandler(username, function(err, validUser) {
    if (err) {
      res.status(500).send(err);
    } else {
      const outputState = validUser ? 'success' : 'failure';
      const message = {
        state: outputState,
        description: 'MAC Member',
        context: contextName,
      };

      // Send completed status message to Github
      setTimeout(function() {
        logger.debug(
          `Sending completed status message to github for ${username}`,
        );
        axios.post(statusAPIUrl, message);
      }, 1000);
      res.status(200).send('MAC membership checked!');
    }
  });
};
