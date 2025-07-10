const express = require( 'express' );
const morgan = require( 'morgan' );
var winston = require('./winston.config');

const chalk = require( 'chalk' );
const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

// Reference: https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications#step-1-%E2%80%94-creating-a-basic-nodeexpress-app
// Winston defines 6 log levels, but you can add custom levels too
// error
// warn
// info
// verbose
// debug
// silly

const app = express();

app.use( morgan( 'combined', { stream: winston.stream } ) );

winston.log( 'error', 'Hello from Winston', {
    someKey: 'some-error'
});
winston.warn( 'Hello from Winston', {
    someKey: 'some-warn'
});
winston.info( 'Hello from Winston', {
    someKey: 'some-info'
});
winston.verbose( 'Hello from Winston', {
    someKey: 'some-verbose'
});
winston.debug( 'Hello from Winston', {
    someKey: 'some-debug'
});

// foo();

const PORT = process.env.PORT || 3000;

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});