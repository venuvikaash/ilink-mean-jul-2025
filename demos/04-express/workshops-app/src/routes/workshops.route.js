const express = require( 'express' );
const controllers = require( '../controllers/workshops.controller' );
const { authenticate } = require( '../middleware/auth' );

const router = express.Router();

router.route( '/' )
    .get(controllers.getWorkshops)
    .post(authenticate, controllers.postWorkshop);

router.route( '/:id' )
    .get(controllers.getWorkshopById)
    .patch(controllers.patchWorkshop)
    .delete(controllers.deleteWorkshop);

router.route( '/:id/speakers' )
    .patch( controllers.addSpeakers );

router.route( '/:id/sessions' )
    .get( controllers.getSessions )

module.exports = router;