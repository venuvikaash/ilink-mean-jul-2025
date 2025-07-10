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

// module -> { exports : {} }
// module -> { exports : { add: add, addArray: addArray, factorial: fn } }
module.exports.add = add;
module.exports.addArray = addArray;
module.exports.factorial = function( num ) {
    let fact = 0;

    for ( let i = 1; i <= num; ++i ) {
        fact *= i;
    }

    return fact;
}

// module.exports will be available for others to require()

console.log( '[2] arithmetic.js ended' );