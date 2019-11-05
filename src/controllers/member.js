import UserModel from '../models/user';

exports.addHandler = function(inputUserDetails, callback) {
  // Get request body parameters
  const email = inputUserDetails.email;
  const githubUsername = inputUserDetails.github;

  // Setup mongoose queries
  const query = { email };
  const currentYear = new Date().getFullYear();
  const appendYearQuery = {
    $addToSet: { 'membership.years': currentYear },
    $set: { 'membership.active': true },
  };
  UserModel.findOneAndUpdate(query, appendYearQuery, function(err, result) {
    if (err) {
      callback({ errorCode: 500, message: err });
    }
    // Can't find github username in database, create it instead
    if (!result) {
      const newUser = new UserModel(inputUserDetails);
      newUser.activateMembership();
      newUser.save(function(err) {
        if (err) {
          // Duplicate key error
          if (err.code === 11000) {
            callback({
              errorCode: 409,
              message: `Github username ${githubUsername} already exists`,
            });
          } else {
            // Some other untreated error
            callback({
              errorCode: 409,
              message: `${err.name}: ${err.errmsg}`,
            });
          }
        } else {
          callback(null, `Added ${githubUsername} to MAC!`);
        }
      });
    } else {
      // Stored github username is different
      if (result.github !== githubUsername) {
        callback({
          errorCode: 409,
          message:
            'Email exists already but stored github account is different, please update.',
        });
      } else {
        callback(null, `Added ${githubUsername} to MAC!`);
      }
    }
  });
};

/*
 * Adds a member to MAC.
 * If user exists already, we add an additional year to their history and activate membership again
 */
exports.add = function(req, res) {
  try {
    exports.addHandler(req.body, function(err, responseMessage) {
      if (err) {
        res.status(err.errorCode).send(err.message);
      } else {
        res.status(201).send(responseMessage);
      }
    });
  } catch (error) {
    response.status(500).send(error);
  }
};

exports.validateHandler = function(inputGithubUsername, callback) {
  const query = { github: inputGithubUsername };
  UserModel.findOne(query, function(err, result) {
    if (err) {
      callback(err);
    }
    const outputResult = !!result ? result.membership.active : false;
    return callback(null, outputResult);
  });
};

/*
 * Checks if the user is a current MAC member
 */
exports.validate = function(req, res) {
  try {
    const githubUsername = req.body.github;
    exports.validateHandler(githubUsername, function(err, validUser) {
      if (err) {
        res.status(500).send(`${err.name}: ${err.errmsg}`);
      }
      res.status(200).send(validUser);
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
