let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new Schema({
    email: {
        type : String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);


/// NOTE // --> You're free to define your User how you like. Passport-Local Mongoose will add a username((make username unique,not duplicate)), 
                //hash and salt field to store the username, the hashed password and the salt value.