require( 'dotenv' ).config(); // this is how we read and load the variables from the .env file

// add this...
require( './data/init' );

const express = require( 'express' );
const morgan = require( 'morgan' );
const indexRouter = require( './routes/index.route' );
const workshopsRouter = require( './routes/workshops.route' );
const sessionsRouter = require( './routes/sessions.route' );
const usersRouter = require( './routes/users.route' );

const logger = require( './middleware/logger' );
const { notFoundHandler, errorHandler } = require( './middleware/errors' );

const app = express();

// app.use( logger );
app.use( morgan( 'combined' ) );

// configure application to read JSON data in incoming requests and set it up on `req.body`
app.use( express.json() );

app.use( indexRouter );
app.use( '/api/auth', usersRouter );
app.use( '/api/workshops', workshopsRouter );
app.use( '/api/sessions', sessionsRouter );

app.use( notFoundHandler );
app.use( errorHandler );

// global error handler middleware
app.use(( err, req, res, next ) => { // a middleware with 4 arguments is an "Error handler middleware"
    const status = err.status || 500;
    res.status( status ).json({
        status: 'error',
        message: err.message
    });
    // next(); // not a good idea to call next when a response is also sent
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, () => {
    console.log( `Check http://localhost:${PORT}` );
});