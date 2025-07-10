// Reference: https://www.npmjs.com/package/chalk
const chalk = require( 'chalk' );

console.log( chalk.blue( 'Hello world!' ) );

// Nest styles
console.log( chalk.red( 'Hello', chalk.bgBlue.bold( 'world' ) + '!' ) );

// define themes
const error = chalk.bold.red;
const warning = chalk.keyword( 'orange' );

console.log( error( 'Error!' ) );
console.log( warning( 'Warning!' ) );

// Chalk can be used as a tagged template literal
// Blocks are delimited by an opening curly brace ({), a style, some content, and a closing curly brace (})
const miles = 18;
const calculateFeet = miles => miles * 5280;

console.log(
    chalk`
	    There are {bold 5280 feet} in a mile.
	    In {bold ${miles} miles}, there are {green.bold ${calculateFeet( miles )} feet}.
    `
);