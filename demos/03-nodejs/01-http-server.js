const http = require( 'node:http' );

const server = http.createServer(
    // request handler function - when an HTTP request comes from a client (say, browser), this function is called
    (req, res) => {
        res.end( 'hello, world' );
    }
);

server.listen( 3000 );