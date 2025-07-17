const sessionService = require('../services/sessions.service');
const socketAuth = require('../middleware/socket-auth');

module.exports = (io) => {
  // Attach middleware to every connection
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`User ${socket.user?.email || socket.user?.id} connected via socket`, socket.id);

    socket.on('upvote', async (sessionId) => {
      try {
        const updated = await sessionService.upvoteSession(sessionId);
        io.emit('sessionUpdated', updated); // io.emit() -> broadcast, socket.io() -> unicast (only to one client)
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('downvote', async (sessionId) => {
      try {
        const updated = await sessionService.downvoteSession(sessionId);
        io.emit('sessionUpdated', updated);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};