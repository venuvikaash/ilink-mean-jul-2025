const path = require( 'path' );
const express = require( 'express' );

const chalk = require( 'chalk' );
const error = ( ...args ) => console.log( chalk.bold.red( ...args ) );
const success = ( ...args ) => console.log( chalk.green( ...args ) );
const info = ( ...args ) => console.log( chalk.yellow( ...args ) );

const app = express();

app.get( '/:action', ( req, res, next ) => {
    let action = req.params.action;
    let { x, y } = req.query;

    // convert to number
    x = +x;
    y = +y;

    // send error if x or y is not a number
    if( isNaN( x ) || isNaN( y ) ) {
        return res.status( 400 ).send( 'Either x or y is not a number' );
    }

    switch( action ) {
        case 'add':
            res.send( ( x + y ).toString() );
            return;
        case 'subtract':
            res.send( ( x - y ).toString() );
            return;
        case 'multiply':
            res.send( ( x * y ).toString() );
            return;
        case 'divide':
            res.send( ( x / y ).toString() );
            return;
        default:
            const err = new Error( 'Unsupported operation<br />operation = add | subtract | multiply | divide ' );
            err.status = 404;
            return next( err );
    }
});

app.use(( req, res, next ) => {
    const err = new Error( 'Format of request: /[operation]?x=12&y=13<br />operation = add | subtract | multiply | divide' );
    return next( err );
});

app.use(( err, req, res, next ) => {
    res.status( err.status || 500 ).send( err.message );
});

const PORT = process.env.PORT || 3000; 

app.listen( PORT, err => {
    if( err ) {
        return error( err.message );
    }

    success( `Server running on http://localhost:${PORT}/` );
});