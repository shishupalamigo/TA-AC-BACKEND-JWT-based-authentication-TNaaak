var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var auth = require('../middlewares/auth');
require('dotenv').config();

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength:  5 }
}, { timestamps: true }); 

userSchema.pre('save', async function(next) {
    if(this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.verifyPassword = async function(password) {
    try {
        var result = await bcrypt.compare(password,  this.password);
        return result;
    } catch (error) {
        return error;
    }
};

userSchema.methods.signToken =  async function(){
    var payload = { userId: this.id, email:  this.email };
    try {
        var token = await jwt.sign(payload, process.env.SECRET );
        return token;
    } catch (error) {
        return error;
    }
}

userSchema.methods.userJSON = function(token){
    return {
        name: this.name,
        email: this.email,
        token: token
    }
}

var User = mongoose.model('User', userSchema);


module.exports = User; 