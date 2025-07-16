const jwt = require( 'jsonwebtoken' );

const authenticate = ( req, res, next ) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const err = new Error( 'Missing or invalid Authorization header' );
        err.status = 401;
        throw err;
    }

    const token = authHeader.replace('Bearer ', '');

    jwt.verify( token, process.env.JWT_SECRET, function( error, claims ) {
        if( error ) {
            const err = new Error( 'Bad credentials' );
            err.status = 401;
            throw err;
        }

        res.locals.claims = claims;

        next();
    });
};

module.exports = {
    authenticate
};