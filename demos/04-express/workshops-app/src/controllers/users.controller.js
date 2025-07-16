const services = require( '../services/users.service' );

const register = async ( req, res ) => {
    const user = req.body;

    // if user = req.body -> {}
    if( Object.keys( user ).length === 0 ) {
        const error = new Error( "Body is missing" );
        error.status = 400;
        throw error;
    }

    try {
        const updatedUser = await services.addUser( user );
        const userToSend = {
            ...updatedUser.toObject()
        };
        delete userToSend.password;

        res.status( 201 ).json({
            status: 'success',
            data: userToSend // internally userToSend.toJSON() runs which returns details about the user that are part of the user document
        });
    } catch( error ) {
        error.status = 400;
        throw error;
    }
};

module.exports = {
    register
};