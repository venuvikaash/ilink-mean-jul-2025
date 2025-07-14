const express = require( 'express' );
const workshops = require( '../data/workshops.json' ); // JSON -> JS array

const router = express.Router();

router.get( '/workshops', ( req, res ) => {
    res.json( workshops ); // res.json( js_array / js_object )
});

router.post( '/workshops', ( req, res ) => {
    // 'Content-Type': 'text/html' (send() sets this HTTP header, end does not)
    res.send( 'Hello Postman' );
});

module.exports = router;