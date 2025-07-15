const express = require( 'express' );
const controllers = require( '../controllers/workshops.controller' );

const router = express.Router();

router.route( '/' )
    .get(controllers.getWorkshops)
    .post(controllers.postWorkshop);

router.route( '/:id' )
    .get(controllers.getWorkshopById)
    .patch(controllers.patchWorkshop);

module.exports = router;