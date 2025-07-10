// Reference:  https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications#step-1-%E2%80%94-creating-a-basic-nodeexpress-app
var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    transports: [
        new winston.transports.File(Object.assign( {}, options.file, { filename: `${appRoot}/logs/error.log`, level: 'error' })),
        new winston.transports.File(Object.assign( {}, options.file, { filename: `${appRoot}/logs/combined.log` })),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;