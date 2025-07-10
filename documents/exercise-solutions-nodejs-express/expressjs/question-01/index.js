const express = require( 'express' );
const chalk = require( 'chalk' );

// this is used to generate short and unique IDs to identify incoming requests
const short = require( 'short-uuid' );

const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

const app = express();

const PORT = process.env.PORT || 3000;

app.use(( req, res, next ) => {
    const requestReceivedAt = new Date();
    res.locals.requestId = short.generate();

    info( `[${res.locals.requestId}] New request recevied at time = ${requestReceivedAt}` );
    info( `[${res.locals.requestId}] req.method = ${req.method} ${req.url}` );
    info( `[${res.locals.requestId}] req.header( 'user-agent' ) = ${req.header( 'user-agent' )}` );
    
    // https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
    // IP address
    info( `[${res.locals.requestId}] req.connection.remoteAddress = ${req.connection.remoteAddress}` );
    // IP address if client is behind a proxy
    info( `[${res.locals.requestId}] req.header( 'x-forwarded-for' ) = ${req.header( 'x-forwarded-for' )}` );

    next();

    const responseSentAt = new Date();
    info( `[${res.locals.requestId}] Time for processing request = ${responseSentAt.getTime() - requestReceivedAt.getTime()}ms` );
});

app.get( '/', (req, res ) => {
    res.send( 'hello, world' );
});

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});