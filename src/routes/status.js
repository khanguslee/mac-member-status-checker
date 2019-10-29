import express from 'express';
const router = express.Router();

router.post('/valid_member', function(req, res) {
  console.log(req.body);
});

module.exports = router;
