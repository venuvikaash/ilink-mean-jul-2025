const Stopwatch = require( './21-stopwatch' );

const stopwatch = new Stopwatch();

// subscribing to the 'start' event
// whenever 'start' event occurs the callback method is called
stopwatch.on(
    'start',
    data => { // callback
        console.log( 'stopwatch started at time : ' + data );
    }
);

// subscribing to the 'end' event
stopwatch.on(
    'stop',
    data => { // callback
        console.log( 'stopwatch ended at time : ' + data );
    }
);

stopwatch.start();

for ( let i = 0; i < 2e9; ++i ) {
    ;
}

stopwatch.stop();

// NOTE: If your event emitter class emits 'error' event it must be handled - else your application will crash when error occurs.