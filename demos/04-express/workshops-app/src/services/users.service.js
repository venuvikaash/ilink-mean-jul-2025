const mongoose = require( 'mongoose' );
const User = mongoose.model( 'User' );

const addUser = async ( user ) => {
    try {
        const insertedUser = await User.create( user );
        return insertedUser;
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

        throw error;
    }
};

module.exports = {
    addUser
};