const EventEmitter = require( 'node:events' );

class Stopwatch extends EventEmitter {
    timeElapsed = 0;
    isRunning = false;
    startTime = null;

    start() {
        if ( this.isRunning ) {
            return;
        }


        let startTime = new Date();
        this.isRunning = true;
        this.startTime = startTime;

        // publish the 'start' event
        // emit(), on() comes from EventEmitter base class
        this.emit( 'start', startTime );
    }

    stop() {
        if ( !this.isRunning ) {
            return;
        }

        this.isRunning = false;
        const endTime = new Date();
        console.log( endTime.getTime() - this.startTime.getTime() );

        this.emit( 'stop', endTime );
    }
}

module.exports = Stopwatch;