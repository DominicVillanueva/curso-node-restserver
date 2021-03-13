const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // endpoints
        this.userRoutes = '/api/users';
        this.authPath = '/api/auth';

        // Conectar a la BD
        this.connectarDB();

        // middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
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
    }

    routes() {
        this.app.use(this.userRoutes, require('../routes/user.routes'));
        this.app.use(this.authPath, require('../routes/auth.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${ this.port }`);
        });
    }
}

module.exports = Server;
