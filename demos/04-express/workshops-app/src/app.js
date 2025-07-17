require( 'dotenv' ).config(); // this is how we read and load the variables from the .env file

// add this...
require( './data/init' );

const http = require( 'http' );
const express = require( 'express' );
const morgan = require( 'morgan' );
const cors = require( 'cors' );
const { Server } = require('socket.io');
const indexRouter = require( './routes/index.route' );
const workshopsRouter = require( './routes/workshops.route' );
const sessionsRouter = require( './routes/sessions.route' );
const usersRouter = require( './routes/users.route' );

const logger = require( './middleware/logger' );
const { notFoundHandler, errorHandler } = require( './middleware/errors' );

const app = express();

if( process.env.NODE_ENV === 'development' ) {
    app.use(cors({
       origin: 'http://localhost:4200'  // allow only this origin - frontend Angular app
    }));
} else {
    // modify CORS setup
    // @todo
}

// app.use( logger );
app.use( morgan( 'combined' ) );

// configure application to read JSON data in incoming requests and set it up on `req.body`
app.use( express.json() );

app.use( indexRouter );
app.use( '/api/auth', usersRouter );
app.use( '/api/workshops', workshopsRouter );
app.use( '/api/sessions', sessionsRouter );

app.use( notFoundHandler );
app.use( errorHandler );

const PORT = process.env.PORT || 3000;

// app.listen( PORT, () => {
//     console.log( `Check http://localhost:${PORT}` );
// });

// Replaced app.listen( PORT ) with the following for setting up web socket support
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // ⚠️ set this appropriately for production
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
  }
});

require('./sockets/voting.socket')(io); // socket logic in separate module

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});