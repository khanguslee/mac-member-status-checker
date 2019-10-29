import express from 'express';
import axios from 'axios';
const router = express.Router();

const BASE_API_URL = 'https://api.github.com';

router.post('/valid_member', function(req, res) {
  console.log(req.body);
  const pullRequestBody = req.body.pull_request;
  const username = pullRequestBody.user.login;
  const commitSHA = pullRequestBody.head.sha;

  const repositoryBody = req.body.repository;
  const repositoryName = repositoryBody.full_name;
  console.log(`Pull Request opened up by: ${username}`);

  const statusAPIUrl = `${BASE_API_URL}/repos/${repositoryName}/statuses/${commitSHA}?access_token=${process.env.ACCESS_TOKEN}`;
  const contextName = 'MAC-member-checker';
  // Pending message
  const pendingMessage = {
    state: 'pending',
    description: 'Checking if you are a MAC member...',
    context: contextName,
  };
  axios.post(statusAPIUrl, pendingMessage);

  // TODO: Connect with database to check if username exists

  // TODO: If username exists, approve status
  const message = {
    state: 'success',
    description: 'MAC Member',
    context: contextName,
  };
  axios.post(statusAPIUrl, message);
  // TODO: If username does not exist, reject PR
});

module.exports = router;
