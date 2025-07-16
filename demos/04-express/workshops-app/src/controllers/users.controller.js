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

const login = async ( req, res ) => {
    const credentials = req.body;

    if( !( credentials?.email && credentials?.password ) ) {
        const error = new Error( "Bad request" );
        error.status = 400;
        throw error;
    }

    const { email, password } = credentials;

    try {
        const user = await services.getUserByEmail( email );

        await services.checkPassword( user, password );

        res.json({
            status: 'success',
            data: "Token to be generated"
        });
    } catch( error ) {
        if( error.type === 'BadCredentials' ) {
            // It is a good practice not to expose to the client what exactly went wrong - such information could aid hackers
            const err = new Error( "Bad credentials" );
            err.status = 403; // Email, password is provided but is incorrect -> 403
            throw err;
        } else {
            error.status = 500;
            throw error;
        }
    }
};

module.exports = {
    register,
    login
};