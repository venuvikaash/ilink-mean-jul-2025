require( 'dotenv' ).config(); // this is how we read and load the variables from the .env file
const express = require( 'express' );
const indexRouter = require( './routes/index.route' );
const workshopsRouter = require( './routes/workshops.route' );

const app = express();

app.use(
    ( req, res, next ) => {
        console.log( 'middleware 1 called' );
        const requestDate = new Date();

        next(); // now Express knows we are done processing the request

        console.log( 'middleware 1 after call to next' );
        const responseDate = new Date();

        console.log( 'Time for processing (in ms) = ', responseDate.getTime() - requestDate.getTime() );
    }
);

// configure application to read JSON data in incoming requests and set it up on `req.body`
app.use( express.json() );

app.use( indexRouter );
app.use( '/api/workshops', workshopsRouter );

const PORT = process.env.PORT || 3000;

app.listen( PORT, () => {
    console.log( `Check http://localhost:${PORT}` );
});