const https = require( 'node:https' );
const fs = require('node:fs');

const server = https.createServer({
    cert: fs.readFileSync(__dirname + '/cert.pem'),
    key: fs.readFileSync(__dirname + '/key.pem')
});

server.on( 'request', // request handler function - when an HTTP request comes from a client (say, browser), this function is called
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

server.listen( 8443 );

console.log( 'end of script' );