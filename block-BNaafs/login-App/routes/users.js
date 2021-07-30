var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({ message: 'User Info' });
});

// Registration 

router.post('/register', async (req, res, next) => {
  try {
    var user =  await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({  user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// Login 

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({ error: " email/password requrired" });
  }
  try {
    var user =  await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ error: "Email not registered!" })
    }
    var result = await user.verifyPassword(password);
    if(!result) {
      return res.status(400).json({ error: "Incorrect Password!" })
    }
    // create token
    var token = await user.signToken();
    // Passing to token and some user info to the logged in user
    res.json({  user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }

  });

module.exports = router;
