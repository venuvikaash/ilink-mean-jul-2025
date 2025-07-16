const mongoose = require( 'mongoose' );
const Session = mongoose.model( 'Session' );
const Workshop = mongoose.model( 'Workshop' );

const addSession = async ( session ) => {
    let workshop;

    try {
        workshop = await Workshop.findById( session.workshopId );

        if ( workshop ) {
            const insertedSession = await Session.create( session );
            return insertedSession;
        }
    } catch( error ) {
        if( error.name === 'ValidationError' ) {
            const dbError = new Error( `Validation error : ${error.message}` );
            dbError.type = 'ValidationError';
            throw dbError;
        }

        if( error.name === 'CastError' ) {
            const dbError = new Error( `Data type error : ${error.message}` );
            dbError.type = 'CastError';
            throw dbError;
        }
    }

    if( !workshop ) {
        const error = new Error( `Workshop not found` );
        error.type = 'ValidationError';
        throw error;
    }
};

const getSessions = async ( workshopId ) => {
    let workshop;

    try {
        workshop = await Workshop.findById( workshopId );

        if( workshop ) {
            const sessions = await Session.find({
                workshopId: workshopId
            });
            return sessions;
        }
    } catch( error ) {
        if( error.name === 'CastError' ) {
            const dbError = new Error( `Data type error : ${error.message}` );
            dbError.type = 'CastError';
            throw dbError;
        }
    }

    if( !workshop ) {
        const error = new Error( `Workshop not found` );
        error.type = 'NotFound';
        throw error;
    }
};

const upvoteSession = async (sessionId) => {
  try {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { $inc: { upvoteCount: 1 } }
    );

    if (!session) {
      const error = new Error('Session not found');
      error.type = 'ValidationError';
      throw error;
    }

    return session;
  } catch (error) {
    if (error.name === 'CastError') {
      const dbError = new Error(`Invalid session ID: ${error.message}`);
      dbError.type = 'CastError';
      throw dbError;
    }

    throw error;
  }
};

const downvoteSession = async (sessionId) => {
  try {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { $inc: { upvoteCount: -1 } }
    );

    if (!session) {
      const error = new Error('Session not found');
      error.type = 'ValidationError';
      throw error;
    }

    return session;
  } catch (error) {
    if (error.name === 'CastError') {
      const dbError = new Error(`Invalid session ID: ${error.message}`);
      dbError.type = 'CastError';
      throw dbError;
    }

    throw error;
  }
};

module.exports = {
    addSession,
    getSessions,
    upvoteSession,
    downvoteSession
};