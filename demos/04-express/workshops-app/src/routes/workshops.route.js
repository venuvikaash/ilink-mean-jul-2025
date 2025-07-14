const express = require( 'express' );
const workshops = require( '../data/workshops.json' ); // JSON -> JS array

const router = express.Router();

router.get( '/workshops', ( req, res ) => {
    res.json( workshops ); // res.json( js_array / js_object )
});

module.exports = router;