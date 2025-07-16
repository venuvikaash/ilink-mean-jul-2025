const mongoose = require( 'mongoose' );

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'general',
        enum: [ 'admin', 'general' ]
    }
});

const emailPat = /^[A-Za-z0-9_\.]+@example\.com$/;
const passwordPat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

// we can customize the schema further before model is created
userSchema.path( 'email' ).validate(
    email => emailPat.test( email ),
    "Invalid email. Please make sure the email is an example.com email."
);

userSchema.path( 'password' ).validate(
    password => passwordPat.test( password ),
    "Password must have at least 1 upper case, 1 lower case, 1 digit, 1 special characters, and should be 8 characters in length."
);

mongoose.model( 'User', userSchema );