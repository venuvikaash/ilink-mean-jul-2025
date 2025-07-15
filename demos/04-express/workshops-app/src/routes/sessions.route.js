const express = require( 'express' );
const services = require( '../controllers/sessions.controller' );

const router = express.Router();

router.route('/')
    .post( services.postSession );
    // .get( services.getSessions )

module.exports = router;