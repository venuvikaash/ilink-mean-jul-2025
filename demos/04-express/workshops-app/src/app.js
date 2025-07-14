require( 'dotenv' ).config(); // this is how we read and load the variables from the .env file
const express = require( 'express' );
const indexRouter = require( './routes/index.route' );
const workshopsRouter = require( './routes/workshops.route' );

const app = express();

// configure application to read JSON data in incoming requests and set it up on `req.body`
app.use( express.json() );

app.use( indexRouter );
app.use( workshopsRouter );

const PORT = process.env.PORT || 3000;

app.listen( PORT, () => {
    console.log( `Check http://localhost:${PORT}` );
});