// resource not found middleware
const notFoundHandler = ( req, res ) => {
    const err = new Error( 'Resource not found' );
    err.status = 404;
    throw err;
};

// global error handler middleware
const errorHandler = ( err, req, res, next ) => { // a middleware with 4 arguments is an "Error handler middleware"
    const status = err.status || 500;
    res.status( status ).json({
        status: 'error',
        message: err.message
    });
    // next(); // not a good idea to call next when a response is also sent
};

module.exports = {
  notFoundHandler,
  errorHandler
};