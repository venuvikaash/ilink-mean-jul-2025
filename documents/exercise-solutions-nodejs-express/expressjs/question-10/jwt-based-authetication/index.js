const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );

const chalk = require( 'chalk' );
const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

const app = express();

app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

// The only 2 users of the application!
const users = [
    {
        username: 'john.doe@example.com',
        password: 'password',
        isAdmin: true
    },
    {
        username: 'mark.smith@example.com',
        password: 'password',
        isAdmin: false
    }
];

function getUser( username, password ) {
    return users.find(function( user ) {
        return user.username === username && user.password === password
    });
}

app.set( 'view engine', 'ejs' );

// to parse form body
app.use( express.urlencoded( { extended: false } ) );

app.get( '/', function( req, res ) {
    res.render( 'login', {
        errorLoggingIn: false
    });
});

app.post( '/login', function( req, res ) {
    // username-password comnination will be checked in DB
    console.log( req.body );

    if( req.body ) {
        var username = req.body.username;
        var password = req.body.password;
    }
    
    const user = getUser( username, password );

    console.log( '*** user = ', user );
    console.log( '*** username = ', username );
    console.log( '*** password = ', password );
    
    if( req.body && user ) {
        console.log( username );
    
        // JWT token has details required for authentication (is allowed or not) and authorization (priviliges)
        const claims = {
            username: user.username,
            isAdmin: user.isAdmin
        };

        console.log( '*** claims = ', claims );

        jwt.sign( claims, 'shh...', { expiresIn: '24h' }, function( error, token ) {
            if( error ) {
                res.status(403).json({
                    message: error.message
                });
                return;
            }

            res.status(200).json({
                message: 'You are now logged in',
                token: token,
                username: username
            });
        });
    } else {
        res.status(403).json({
            message: 'Username or password is incorrect'
        });
    }
});

app.get( '/private', function( req, res ) {
    const authorizationHeader = req.get( 'Authorization' ) || req.get( 'authorization' );

    if( !authorizationHeader ) {
        res.status( 403 ).redirect( '/' );
        return;
    }

    // Remove 'Bearer' prefix
    const token = authorizationHeader.split( ' ' )[1];

    // Verify token
    jwt.verify( token, 'shh...', function( error, claims ) {
        if( error ) {
            res.status( 403 ).redirect( '/' );
            return;
        }

        res.render( 'private', {
            claims: claims
        });
    });

    if( req.session && req.session.user === undefined ) {
        // res.status(403).json({
        //     message: 'You are not authorized to view this page'
        // });
        res.redirect( '/' );
        return;
    }
});

app.post( '/logout', function( req, res ) {
    if( req.session ) {
        req.session.destroy();
    }
    res.redirect( '/' );
})

const PORT = process.env.PORT || 3000;

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});