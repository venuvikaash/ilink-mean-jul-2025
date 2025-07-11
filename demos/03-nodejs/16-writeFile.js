const fs = require( 'node:fs/promises' );
const path = require( 'node:path' );

const doFileOps = async () => {
    try {
        await fs.writeFile(
            path.join( 'hello.txt' ),
            'Hello, world!',
            { encoding: 'utf-8' },
            // callback if callback-based instead of promise-based
        );
    } catch( err ) {
        console.log( err.message );
    }
};

doFileOps();