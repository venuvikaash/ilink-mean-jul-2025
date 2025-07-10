// implicitly return value of a function is the special `undefined` value
// function sum( x , y ) {

// }

// console.log( sum( 1, 2 ) ); // prints undefined
// callback refers to the function that is passed
function sum( x, y, callback ) {
    setTimeout(
        () => { // f -> put in quue, Node picks up, executes, Node gets the answer
            console.log( 'inside f' );

            // return x + y; // returns to Node.js - useless
            callback( x + y ); // pass on the result to the callback function
        },
        3000
    );

    // nothing else to do
    // return undefined;
}

// console.log() will print undefined - so it is commented
// console.log(
    sum(
        1,
        2,
        function( result ) {
            // logic to do something with the result
            console.log( result );
        }
    )
// );

sum(
    3,
    4,
    function( result ) {
        // logic to do something else with the result
        console.log( result * result );
    }
)