const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

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

// IMPORTANT: Decides the "strength" of the salt (should not be too high as salting will take long time and occupy CPU time (blocking) - nothing else will execute in the app in that time. should not be too low, else the password is not securely hashed)
const SALT_ROUNDS = 10;

// IMPORTANT: DO NOT use arrow function here (the "this" binding will not be set correctly for an arrow function)
userSchema.pre( 'save', function( done ) {
    const user = this; // const user -> new User()

    if( !user.isModified( 'password' ) ) {
        return done();
    }

    bcrypt.genSalt( SALT_ROUNDS, function( err, salt ) {
        if( err ) {
            return done( err ); // Mongoose will not insert the user document
        }

        bcrypt.hash( user.password, salt, function( err, hashedPassword ) {
            if( err ) {
                return done( err );
            }

            user.password = hashedPassword;
            done(); // pass no arguments to done() to signify success
        });
    })
});

// will be used to compare plain text password with the hashed password at the time of login
userSchema.methods.checkPassword = async function( plainTextPassword ) {
    const hashedPassword = this.password;

    // this line will throw an error sometimes
    // if on the other hand bcrypt is able to compare it will return true / false
    const isMatch = await bcrypt.compare( plainTextPassword, hashedPassword );
    return isMatch;
}

mongoose.model( 'User', userSchema );