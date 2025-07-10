setTimeout(
    () => { // f
        console.log( 1 );

        setTimeout(
            () => console.log( 3 ), // h
            0
        );
    },
    0
);

// EQ: [ f ]

setTimeout(
    () => console.log( 2 ), // g
    0
);

// EQ: [ f, g ]

// Pick up f for execution. EQ: [ g ]
// f() -> print 1
// EQ: [ g, h ]

// Pick up g for execution. EQ: [ h ]
// g() -> print 2

// Pick up h for execution. EQ: [ ]
// h() -> print 3

// 2 1 3
// 1 2 3