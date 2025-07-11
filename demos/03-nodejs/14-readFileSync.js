const fs = require( 'node:fs' );
const path = require( 'node:path' );

// synchronous method - completes the file reading and only then will it return
try {
    const contents = fs.readFileSync(
        path.join( __dirname, 'cert.pem' ),
        {
            encoding: 'utf-8'
        },
    );

    console.log( 'file is read. contents = ', contents );
} catch( err ) {
    console.log( err.message );
}

console.log( 'end of script' );