const express = require( 'express' );

const chalk = require( 'chalk' );
const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

const app = express();

app.get( '/', function( req, res ) {
    res.end( 'hello' );
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});