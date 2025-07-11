const fs = require( 'node:fs/promises' );
const path = require( 'node:path' );

// synchronous method - completes the file reading and only then will it return
const doFileOps = async () => {
    try {
        const contents = await fs.readFile(
            path.join( __dirname, 'cert.pem' ),
            {
                encoding: 'utf-8'
            },
        );

        console.log( 'file is read. contents = ', contents );
    } catch( err ) {
        console.log( err.message );
    }
};

doFileOps();

console.log( 'end of script' );