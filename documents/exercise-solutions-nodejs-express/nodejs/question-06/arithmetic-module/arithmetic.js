const PI = Math.PI;
const rectangle = ( x, y ) => x * y;

const square = ( x ) => rectangle( x, x );
const circle = ( r ) => Math.PI * r * r;

module.exports = {
    square,
    circle
};