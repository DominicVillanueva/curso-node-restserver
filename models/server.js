const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config.db');
const { createServer } = require('http');
const { socketController } = require('../sockets/socket.controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // SOCKET IO
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);
        // endpoints
        this.path = {
            auth: '/api/auth',
            category: '/api/category',
            product: '/api/products',
            search: '/api/searches',
            user: '/api/users',
            upload: '/api/uploads',
        }

        // Conectar a la BD
        this.connectarDB();

        // middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();

        // SOCKETS
        this.sockets();
    }

    async connectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
        
        // Directorio público
        this.app.use(express.static('public'));

        // Files upload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth.routes'));
        this.app.use(this.path.category, require('../routes/category.routes'));
        this.app.use(this.path.product, require('../routes/product.routes'));
        this.app.use(this.path.search, require('../routes/search.routes'));
        this.app.use(this.path.user, require('../routes/user.routes'));
        this.app.use(this.path.upload, require('../routes/uploads.routes'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${ this.port }`);
        });
    }
}

module.exports = Server;
