var express = require('express');
const User = require('../models/User');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//registring new user

router.post('/register', async (req, res, next) => {
  let data = req.body;
  try {
    let user = await User.findOne({ username: data.username });

    if (user) {
      return res.status(400).json({ error: 'user already exist' });
    }

    let createdUser = await User.create(data);
    let token = await createdUser.createToken();
    createdUser.token = token;
    return res.json({ user: createdUser });
  } catch (error) {
    next(error);
  }
});

//login user

router.post('/login', async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: ' email/password required',
    });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: ' user does not exist.',
      });
    }

    let result = user.verifyPassword(password);

    if (!result) {
      return res.status(400).json({
        error: ' incorrect password.',
      });
    }

    let token = await user.createToken();

    return res.json({ token, user });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
