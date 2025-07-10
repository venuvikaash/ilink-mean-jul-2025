// Promise - a class introduced in ES2015
// sum function based on the Promise pattern
function sum( x, y ) {
    return new Promise(
        ( resolve, reject ) => {
            // console.log( typeof resolve ); // 'function'
            // console.log( typeof reject ); // 'function'

            setTimeout(
                () => {
                    resolve( x + y ); // we are informing the promise object of the result (x + y)
                },
                3000
            );
        }
    );
}

// ---

// using sum()
// then(), catch() -> 2 methods of Promise class
// the moment Promise object gets the resolved value (answer), the function passed to then (f) is called
sum( 1, 2 ) // p1
    .then(
        function( result1 ) { // f
            console.log( result1 );

            return sum( result1, 3 ); // NOTE: Not to forget to return the promise (p5) -> after some time when we get data 6
        }
    ) // p2 (p2 is a copycat of p5) -> p2 will also resolve with value 6
    .then(
        function( result2 ) {
            console.log( result2 );

            return sum( result2, 4 );
        }
    ) // p3
    .then(
        function( result3 ) {
            console.log( result3 );
        }
    ); // p4

console.log( 'script ends' );