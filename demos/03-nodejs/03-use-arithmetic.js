console.log( '[3] use-arithmetic.js started' );

// we get the module.exports fro arithmetic.js
const arithmetic = require("./03-arithmetic");

// Note that multiply is not available
console.log( arithmetic );

console.log( arithmetic.addArray( [ 1, 2, 3, 4 ] ) );

console.log( '[4] use-arithmetic.js ended' );