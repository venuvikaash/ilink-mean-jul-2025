const express = require( 'express' );
const services = require( '../controllers/users.controller' );

const router = express.Router();

router.post( '/register', services.register );
router.post( '/login', services.login );

module.exports = router;