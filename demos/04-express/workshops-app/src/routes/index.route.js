const express = require('express');

const router = express.Router();

router.get('/', ( req, res ) => {
    res.end( 'This is the workshops app. It serves details of workshops happening nearby.' );
});

router.get('/home', ( req, res ) => {
    res.redirect('/');
});

module.exports = router;