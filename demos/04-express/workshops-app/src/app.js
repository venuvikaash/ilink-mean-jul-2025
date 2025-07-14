require( 'dotenv' ).config(); // this is now we read and load the variables from the .env file
const express = require( 'express' );

const app = express();

app.get('/',( req, res ) => {
    res.end( 'This is the workshops app. It serves details of workshops happening nearby.' );
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, () => {
    console.log( `Check http://localhost:${PORT}` );
});