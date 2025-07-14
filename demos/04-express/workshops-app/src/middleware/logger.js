const logger = ( req, res, next ) => {
    console.log( 'middleware 1 called' );
    const requestDate = new Date();

    next(); // now Express knows we are done processing the request

    console.log( 'middleware 1 after call to next' );
    const responseDate = new Date();

    console.log( 'Time for processing (in ms) = ', responseDate.getTime() - requestDate.getTime() );
};

module.exports = logger;