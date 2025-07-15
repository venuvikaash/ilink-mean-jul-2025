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

module.exports = {
    addSession
};