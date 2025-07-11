// MOTIVATION: We are reading large file - we don't want to occupy much memory (readFile reads entire file contents and takes up lot of memory)
const fs = require( 'fs' );
const path = require( 'node:path' );

const rs = fs.createReadStream( path.join( __dirname, 'book.pdf' ) );

// rs is an event emitter object. 'data' is an event.
// 'data' event is emitted when a chunk is read
rs.on( 'data', chunk => {
    console.log( chunk.length );
    console.log( '*** chunk ***' );
    console.log( chunk );
});

rs.on( 'end', () => {
    console.log( 'end of file read' );
});

rs.on( 'error', err => {
    console.log( err.message );
});


// const btn = document.getElementById('#buy');

// btn.addEventListener( 'click', function handleClick() {} )
// btn.addEventListener( 'dblclick', function handleDblClick() {} )

// <button (click)="handleClick()" (dblclick)="handleDblClick()">Buy</button>