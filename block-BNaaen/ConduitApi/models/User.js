let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
const Profile = require('./Profile');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required:  true },
  password: { type: String, required: true },
  token: String,
  bio: String,
  image: { type: String, default: null },
  profile: { type: mongoose.Types.ObjectId, ref: 'Profile' },
  articles: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
  comments: [{ type: mongoose.Types.ObjectId, red: 'Comment' }]
});

userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    let profileData = {
      username: this.username,
      bio: this.bio,
      image: this.image,
    };

    let profile = await Profile.create(profileData);
    this.profile = profile.id;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.createToken = async function (password) {
  try {
    let profileData = await Profile.findById(this.profile);
    let payload = {
      username: profileData.username,
      bio: profileData.bio,
      image: profileData.image,
    };

    let token = await jwt.sign(payload, 'thisissecret');

    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function(token) {
  return {
      username: this.username,
      email: this.email,
      bio: this.bio,
      image: this.image,
      token: token
  }
}

userSchema.methods.displayUser = function(id = null) {
  return {
      username: this.username,
      bio: this.bio,
      image: this.image, 
      following: id ? this.followersList.includes(id) : false
  }
}

let User = mongoose.model('User', userSchema);

module.exports = User;