const express = require( 'express' );
const workshops = require( '../data/workshops.json' ); // JSON -> JS array

let nextId = 13;

const router = express.Router();

router.get( '/workshops', ( req, res ) => {
    res.json( workshops ); // res.json( js_array / js_object )
});

router.post( '/workshops', ( req, res ) => {
    const newWorkshop = req.body;

    newWorkshop.id = nextId;
    ++nextId;
    workshops.push( newWorkshop );

    // 'Content-Type': 'text/html' (send() sets this HTTP header, end does not)
    res.status( 201 ).send( newWorkshop );
});

module.exports = router;