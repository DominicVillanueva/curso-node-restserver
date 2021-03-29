const url = (window.location.hostname.includes("localhost")) ?
    'http://localhost:3000/api/auth/' :
    'https://restserver-curso-dom.herokuapp.com/api/auth/';

let user = null;
let socket = null;

// REFERENCES DOM
const textUID = document.querySelector('#textUID');
const textMessage = document.querySelector('#textMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessage = document.querySelector('#ulMessage');
const btnSalir = document.querySelector('#btnSalir');

const validarJWT = async() => {
    const token = localStorage.getItem('x-token') || '';
    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor');
    }

    const res = await fetch(url,{
        headers: { 'x-token': token },
    });

    const { user: userDB, token: tokenDB } = await res.json();
    localStorage.setItem('x-token', tokenDB);
    user = userDB;

    document.title = user.name;
    await connectSocket();
};

const connectSocket = async() => {
    socket = io({ 
        'extraHeaders': {
            'x-token': localStorage.getItem('x-token'),
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-message', showMessages);
    socket.on('active-users', showUsers);
    socket.on('private-message', (payload) => {
        console.log('privado:', payload);
    })
}

const showUsers = (users = []) => {
    let usersHtml = '';
    users.forEach(({ name, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });

    ulUsers.innerHTML = usersHtml;
}

textMessage.addEventListener('keyup', ({ keyCode }) => {
    const message = textMessage.value;
    const uid = textUID.value;
    if(keyCode !== 13) return;
    if(message.length === 0) return;

    socket.emit('send-message', {message, uid});

    textMessage.value = '';
});

const showMessages = (messages = []) => {
    let messagesHtml = '';
    messages.forEach(({ name, message }) => {
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${ name }</span>
                    <span>${ message }</span>
                </p>
            </li>
        `
    });

    ulMessage.innerHTML = messagesHtml;
}

const main = async() => {

    // Validar JWT
    await validarJWT();
};

main();
