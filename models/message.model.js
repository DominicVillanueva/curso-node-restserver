class Message {
    constructor(uid, name, message) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}

class ChatMessage {
    constructor() {
        this.messages = [];
        this.users = {};
    }

    get last10() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    get userList() {
        return Object.values(this.users); // [{}, {}]
    }

    sendMessage(uid, name, message) {
        this.messages.unshift(new Message(uid, name, message));
    }

    connectUser(user) {
        this.users[user.id] = user;
    }

    desconnectUser(id) {
        delete this.users[id];
    }
}

module.exports = ChatMessage;

