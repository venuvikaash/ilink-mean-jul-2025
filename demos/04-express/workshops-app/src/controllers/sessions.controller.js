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

module.exports = {
    postSession
}