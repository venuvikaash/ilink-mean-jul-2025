console.log( '[3] use-arithmetic.js started' );

// we get the module.exports from arithmetic.js
const arithmetic = require("./03-arithmetic");

// IMPORTANT: The file will NOT run once again
const arithmetic2 = require("./03-arithmetic");

// Note that multiply is not available
console.log( arithmetic );

console.log( arithmetic.addArray( [ 1, 2, 3, 4 ] ) );
console.log( arithmetic2.addArray( [ 1, 2, 3, 4 ] ) );

console.log( '[4] use-arithmetic.js ended' );