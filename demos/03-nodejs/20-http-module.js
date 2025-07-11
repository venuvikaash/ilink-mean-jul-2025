const http = require( 'node:http' );
const url = require( 'node:url' );
const fs = require( 'node:fs' );

const server = http.createServer();

server.listen( 3000 );

server.on('listening', () => {
    console.log( 'started listening on port 3000' );
});

server.on('error', err => {
    console.log( 'could not start : ' + err.message );
});

// HTTP server is an event emitter
server.on('request', (req, res) => {
    const reqUrl = req.url;
    const method = req.method;

    const parts = url.parse( reqUrl, true );
    console.log( parts );
    console.log( method );

    try {
        const contents = fs.readFileSync( __dirname + parts.pathname + '.html' );

        res.writeHead( 200, {
            'Content-Type': 'text/html'
        });
        res.end( contents );
    } catch( err ) {
        // res.writeHead( 404 );
        // res.end();

        res.end( `${parts.query.message} from ${parts.query.from}` );
    }
});

console.log( 'end of script' );