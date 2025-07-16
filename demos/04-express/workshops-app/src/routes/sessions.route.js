const express = require( 'express' );
const controllers = require( '../controllers/sessions.controller' );

const router = express.Router();

router.route('/')
    .post( controllers.postSession );
    // .get( services.getSessions )

router.patch( '/:id/upvote', controllers.patchUpvote );
router.patch( '/:id/downvote', controllers.patchDownvote );

module.exports = router;