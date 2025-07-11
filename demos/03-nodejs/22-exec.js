const { exec } = require( 'node:child_process' );

console.log( process.env.JAVA_HOME );
console.log( process.argv ); // [ 'node', '22-exec.js', 'SpecialInteger.java' ]

const filename = process.argv[2];

// execFile -> to execute .exe etc.
// the command we pass executes in a child process - so no worry about performance of main process
// exec -> to execute commands in the shell - we get a reference to the child process stdout, stderr
exec( `javac ${filename}`, ( err, stdout, stderr ) => {
    if( err ) {
        console.log( 'Error!' );
        console.log( err.message );
    }

    if ( stdout === '' ) {
        console.log( 'Successfully compiled!' );
    }

    // if ( stderr !== '' ) {
    //     console.log( 'Error!' );
    //     console.log( stderr );
    // }
});