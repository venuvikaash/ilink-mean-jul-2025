const express = require( 'express' );
const services = require( '../controllers/sessions.controller' );
const { authenticate, authorize } = require( '../middleware/auth' );

const router = express.Router();

router.route('/')
    // .get( services.getSessions )
    .post( authenticate, services.postSession );

router.patch( '/:id/upvote', authenticate, services.patchUpvote );
router.patch( '/:id/downvote', authenticate, services.patchDownvote );

module.exports = router;