const express = require( 'express' );
const controllers = require( '../controllers/workshops.controller' );

const router = express.Router();

router.route( '/' )
    .get(controllers.getWorkshops)
    .post(controllers.postWorkshop);

router.route( '/:id' )
    .get(controllers.getWorkshopById)
    .patch(controllers.patchWorkshop)
    .delete(controllers.deleteWorkshop);

router.route( '/:id/speakers' )
    .patch( controllers.addSpeakers );

module.exports = router;