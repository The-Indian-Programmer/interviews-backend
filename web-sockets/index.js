// Initiate socket server

const socketServer = (server) => {
    const io = require('socket.io')(server);

    let totalOnlineUsers = [];

    io.on('connection', (socket) => {

        /* Connect to socket */
        let connectedData = {
            socketId: socket.id,
            userId: socket.handshake.query.userId ? socket.handshake.query.userId : ''
        }
        io.emit('connected', connectedData)

        totalOnlineUsers = [...totalOnlineUsers, connectedData]

        io.emit('updateOnlineStatus', totalOnlineUsers);

        
        socket.on('disconnect', () => {
            totalOnlineUsers = totalOnlineUsers.filter(item => item.socketId !== socket.id)
            io.emit('updateOnlineStatus', totalOnlineUsers);
            io.emit('disConnected', connectedData)
        });

        socket.on('like', (data) => {
            console.log(data)
        })

        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        });
    });
}

module.exports = socketServer;