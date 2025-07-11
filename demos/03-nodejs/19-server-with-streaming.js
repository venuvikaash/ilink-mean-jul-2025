// Using CommonJS (default) module system
const http = require( 'node:http' );
const fs = require( 'fs' );
const path = require( 'node:path' );

// using ES2015 module system - add "type": "module" in package.json to enable it
// import http from 'node:http';
// import fs from 'node:fs';
// import path from 'node:path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(
    // HTTP req is a read stream object
    // HTTP res is a write stream object
    (req, res) => {
        const rs = fs.createReadStream( path.join( __dirname, 'book.pdf' ) );

        // res.writeHead( 'Content-Type', 'application/pdf' );

        // the moment we read something from the file, we write it to the HTTP response
        // rs.on( 'data', chunk => {
        //     res.write( chunk );
        // });

        // rs.on( 'end', () => {
        //     res.end();
        // });

        // all the above code + some more code to handle buffer overflows due to difference in speed of read/write (write speed < read speed) is taken care in pipe()
        rs.pipe( res );

        rs.on( 'error', err => {
            res.statusCode = 500;
            res.end();
        });
    }
);

server.listen( 3000 );

// export is ES2015 style now and not using module.exports
// export {

// }
