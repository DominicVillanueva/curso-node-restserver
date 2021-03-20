const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // endpoints
        this.path = {
            auth: '/api/auth',
            category: '/api/category',
            product: '/api/products',
            search: '/api/searches',
            user: '/api/users',
        }

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
        this.app.use(this.path.auth, require('../routes/auth.routes'));
        this.app.use(this.path.category, require('../routes/category.routes'));
        this.app.use(this.path.product, require('../routes/product.routes'));
        this.app.use(this.path.search, require('../routes/search.routes'));
        this.app.use(this.path.user, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${ this.port }`);
        });
    }
}

module.exports = Server;
