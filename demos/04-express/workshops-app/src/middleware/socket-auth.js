const jwt = require('jsonwebtoken');

const socketAuthMiddleware = (socket, next) => {
  console.log( 'socket middleware' );
  const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return next(new Error('Authentication token missing or invalid'));
  }

  const actualToken = token.replace('Bearer ', '');

  try {
    const payload = jwt.verify(actualToken, process.env.JWT_SECRET);
    socket.user = payload; // attach decoded user info to the socket
    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
};

module.exports = socketAuthMiddleware;