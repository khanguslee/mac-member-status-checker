import UserModel from '../models/user';

exports.add = function(req, res) {
  try {
    const query = { github: req.body.github };
    UserModel.exists(query).then(userExists => {
      if (!userExists) {
        const user = new UserModel(req.body);
        user.setMembershipActive();
        user.save(function(err, doc) {
          if (err) {
            console.log(err);
            res.status(400).send(`${err.name}: ${err._message}`);
          } else {
            res.status(201);
          }
        });
      } else {
        console.log('User exists already');
      }
    });
  } catch (error) {
    response.status(500).send(error);
  }
};
