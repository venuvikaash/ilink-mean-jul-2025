setTimeout(
    () => console.log( 1 ), // f - even though this function is eligible for execution immediately it is not executed immediately (otherwise 1 would be printed immediately)
    0
);

// Event queue (a queue of functions waiting to be executed)
// [ f ]

console.log( 2 ); // prints 2

// nothing else to execute
// Now Node.js checks the evnt queue, and picks up the first function in the queue, and executes it
// f() -> prints 1