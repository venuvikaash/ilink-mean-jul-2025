console.log( '[1] arithmetic.js started' );

// public
const add = (x , y) => x + y;

// private
const multiply = (x , y) => x * y;

// public
function addArray( arr ) {
    let sum = 0;

    for ( let i = 0; i < arr.length; ++i ) {
        sum += arr[i];
    }

    return sum;
}
// IMPORTANT: ALWAYS use `module.exports`. NEVER use plain `exports`

// By default: module = { exports : {} }
// By default: exports -> {} (same object as module.exports)
// module -> { exports : { add: add, addArray: addArray, factorial: fn } }

// Option 1
// module.exports.add = add;
// module.exports.addArray = addArray;
// module.exports.factorial = function( num ) {
//     let fact = 0;

//     for ( let i = 1; i <= num; ++i ) {
//         fact *= i;
//     }

//     return fact;
// };

// Option 2 - Assign a new object
// `exports` will still refer to the same default object (i.e. {})
module.exports = {
    // if the property name and the initializer variable have the same identifier - `add` here, then you can simplify this way
    // add: add
    add,
    addArray,
    factorial( num ) {
        let fact = 0;

        for ( let i = 1; i <= num; ++i ) {
            fact *= i;
        }

        return fact;
    }
}

// module.exports will be available for others to require()

console.log( '[2] arithmetic.js ended' );