// Promise - a class introduced in ES2015
// sum function based on the Promise pattern
// function sumSync( x, y ) {
// }
// const result = sumSync( 1, 2 ); // get 3 synchronously - next line does not execute till result is obtained

function sum( x, y ) {
    return new Promise(
        ( resolve, reject ) => {
            // console.log( typeof resolve ); // 'function'
            // console.log( typeof reject ); // 'function'

            if ( typeof x !== 'number' || typeof y !== 'number' ) {
                return reject( new Error( `At least one input was not a number. Received ${x}, ${y}` ) );
                // return;
            }

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

// async function soSerialOperations() {
// When the first await is encountered it returns a promise
const doSerialOperations = async () => {
    try {
        console.log( 3 );
        const result1 = await sum(1, 2); // await is a way for the doSerialOperations() to give up control of the main thread - return promise p
        console.log( 4 );
        console.log('result1 = ', result1);

        const result2 = await sum( result1, 3 ); // the function gives up control, so that if something is waiting in the event queue it will be executed.
        console.log('result2 = ', result2);

        const result3 = await sum( result2, 4 );
        console.log('result3 = ', result3);

        return result3; // p will resolve with this value
    } catch( err ) {
        console.log( err.message );
    }

    // return undefined;
}

console.log( 1 );

// console.log( doSerialOperations() ); // promise object (p) is returned b doSerialOperations()
doSerialOperations().then(
    finalResult => console.log( 'finalResult = ', finalResult )
)

console.log( 2 );

console.log( 'script ends' );

// setTimeout(
//     () => {

//     },
//     3000
// )

// Answers
// 1 3 4 2
// 1 2 3 4
// ---
// 1 3 2