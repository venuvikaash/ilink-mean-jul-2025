const fs = require( 'fs' );
const path = require( 'node:path' );

const ws = fs.createWriteStream( path.join( __dirname, 'hello2.txt' ) );

for ( let i = 0; i < 1e6; ++i ) {
    ws.write( 'Hello, world!\n' );
}

ws.end();