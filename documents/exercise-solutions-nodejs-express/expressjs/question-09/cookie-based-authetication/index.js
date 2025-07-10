const express = require( 'express' );
const session = require( 'express-session' );
const mongoose = require( 'mongoose' );

const MongoStore = require( 'connect-mongo' )( session );

const chalk = require( 'chalk' );
const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

mongoose.connect( 'mongodb://localhost:27017/cookie-store' );

mongoose.connection.on( 'connected', function() {
    console.log( 'connected to cookie-store DB' );
})

const app = express();

// The only user of the application!
const user = {
    username: 'john.doe@example.com',
    password: 'password'
};

app.set( 'view engine', 'ejs' );

// to parse form body
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

app.use(session({
    // NOTE: In practice, secret should NOT be mentioned in code - maintain as an environment variable
    secret: 'shh',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.get( '/', function( req, res ) {
    res.render( 'login', {
        errorLoggingIn: false
    });
});

app.post( '/login', function( req, res ) {
    // NOTE: In practice, username-password comnination will be checked in DB
    if( req.body && req.body.username === user.username && req.body.password === user.password ) {
        // we set up the logged in user details on req.session
        req.session.user = user;
        res.redirect( '/private' );
    } else {
        res.status(403).render( 'login', {
            errorLoggingIn: true
        });
    }
});

app.get( '/private', function( req, res ) {
    if( req.session.user === undefined ) {
        // res.status(403).json({
        //     message: 'You are not authorized to view this page'
        // });
        res.redirect( '/' );
        return;
    }

    res.header( 'Cache-Control', 'no-store' );
    res.render( 'private' );
});

app.post( '/logout', function( req, res ) {
    // remove session details for the logged in user - this effectively logs them out
    if( req.session ) {
        req.session.destroy();
    }
    res.redirect( '/' );
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});