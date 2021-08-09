
let jwt = require('jsonwebtoken');

module.exports = {
  isLoggedIn: async function (req, res, next) {
    try {
      let token = req.headers.authorization;

      if (!token) {
        return res.status(400).json({ error: 'user must be logged in' });
      } else {
        let profileData = await jwt.verify(token, 'thisissecret');
        req.user = profileData;
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  authOptional: async (req, res, next) => {
    let token = req.headers.authorization;
    try{
        if(token) {
            let payload = await jwt.verify(token, process.env.SECRET);
            req.user = payload;
            return next();
        }else {
            return next();
            
        }
    }catch(error) {
        next(error);
    }
},
};