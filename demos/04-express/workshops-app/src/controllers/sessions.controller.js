const services = require( '../services/sessions.service' );

const postSession = async ( req, res ) => {
    const session = req.body;

    try {
        let newSession = await services.addSession( session );

        res.status( 201 ).json({
            status: 'success',
            data: newSession
        });
    } catch( error ) {
        error.status = 400;
        throw error;
    }
};

const patchUpvote = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedSession = await services.upvoteSession(id);
    res.json({
      status: 'success',
      data: updatedSession
    });
  } catch (error) {
    error.status = 400;
    throw error;
  }
};

const patchDownvote = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedSession = await services.downvoteSession(id);
    res.json({
      status: 'success',
      data: updatedSession
    });
  } catch (error) {
    error.status = 400;
    throw error;
  }
};

module.exports = {
    postSession,
    patchUpvote,
    patchDownvote
}