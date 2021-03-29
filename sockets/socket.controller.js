const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { MessageModel } = require('../models');

const chatMessages = new MessageModel();

// Delete reference new Socket
const socketController = async(socket = new Socket(), io) => {
    const user = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!user) {
        return socket.disconnect(); // Desconectar usuario 
    }

    // Agregar el usuario conectado
    chatMessages.connectUser(user);
    // EMITIR LA CONEXIÓN DE UN USUARIO
    io.emit('active-users', chatMessages.userList);
    // Recibir los mensajes enviados al usuario activo
    socket.emit('receive-message', chatMessages.last10);

    // Conectar usuario a una sala privada
    // Crear una sala con el id del usuario
    socket.join(user.id); // GLOBAL, socket.id, user.id;

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessages.desconnectUser(user.id);
        io.emit('active-users', chatMessages.userList);
    })

    socket.on('send-message', ({ uid, message }) => {
        if(uid) {
            // message private
            socket.to(uid).emit('private-message', { de: user.name, message});
        } else {
            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('receive-message', chatMessages.last10);
        }
    })
};

module.exports = {
    socketController,
};

