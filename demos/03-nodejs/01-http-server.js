const http = require( 'node:http' );

const server = http.createServer(
    // request handler function - when an HTTP request comes from a client (say, browser), this function is called
    // req -> first argument -> request object
    // res -> second argument -> response object
    (req, res) => {
        console.log( req.method );
        res.write( 'some data' )
        res.write( 'some data' )
        res.write( 'some data' )
        res.write( 'some data' )
        res.write( 'some data' )
        res.end( 'hello, world!!!' ); // end() is a method of response object
    }
);

server.listen( 3000 );

console.log( 'end of script' );