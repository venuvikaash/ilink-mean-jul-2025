const path = require( 'path' );
const express = require( 'express' );
const jsonUtilities = require( './json-utilities' );

const chalk = require( 'chalk' );
const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

const app = express();

app.use( express.json() ); // enable parsing JSON data in request body
app.use( express.urlencoded( { extended: false } ) ); // enable parsing URL encoded data in request body

app.get( '/', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public', 'index.html' ) );
});

app.get( '/contact', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public', 'contact.html' ) );
});

app.post( '/message', ( req, res ) => {
    const message = req.body;

    jsonUtilities.add( message, path.join( __dirname, 'messages.json' ), err => {
        if( err ) {
            return res.status( 500 ).send( `Sorry ${message.name}, there was an error capturing your message` );
        }

        res.send( `Thanks for your message ${message.name}. I will get back to you shortly. Go <a href="/">home</a>` );
    });
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});