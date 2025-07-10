const http = require( 'http' );
const url = require( 'url' );

const server = http.createServer(( req, res ) => {
    let { pathname, query : { x, y } = { } } = url.parse( req.url, true );

    // convert to number
    x = +x;
    y = +y;

    // send error if x or y is not a number
    if( isNaN( x ) || isNaN( y ) ) {
        res.statusCode = 400;
        res.end( 'Either x or y is not a number' );
        return;
    }

    switch( pathname ) {
        case '/add':
            res.end( ( x + y ).toString() );
            return;
        case '/subtract':
            res.end( ( x - y ).toString() );
            return;
        case '/multiply':
            res.end( ( x * y ).toString() );
            return;
        case '/divide':
            res.end( ( x / y ).toString() );
            return;
        default:
            res.statusCode = 404;
            res.end( 'Unsupported operation' );
            return;
    }
});

const PORT = process.env.PORT || 3000;

server.listen( PORT );