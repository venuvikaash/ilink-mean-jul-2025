setTimeout(
    () => console.log( 1 ), // f
    0
);

// Event queue: [ f ]

setTimeout(
    () => console.log( 2 ), // g
    0
);

// Event queue: [ f, g ]

// What is printed?
// Choices
// 1 2 -> Correct answer
// 2 1
// Unpredictable