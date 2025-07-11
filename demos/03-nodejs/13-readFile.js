const fs = require( 'node:fs' );
const path = require( 'node:path' );

// console.log(__dirname, __filename);

// this asynchronous method takes in a callback argument which is called once the file is read
// readFile() is non-blocking
// If you do not provide the encoding used for the file, a Buffer is returned (an array of bytes)
fs.readFile(
    path.join( __dirname, 'cert.pem' ),
    {
        encoding: 'utf-8'
    },
    ( err, contents ) => {
        if( err ) {
            console.log( err.message );
            return;
        }

        // console.log( 'file is read. contents = ', contents.toString( 'utf-8' ) );
        console.log( 'file is read. contents = ', contents );
    }
);

console.log( 'end of script' );
// lot of code...