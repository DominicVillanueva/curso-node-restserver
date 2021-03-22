const { v4: uuidv4 } = require('uuid');

const path = require('path');

const extensions = ['png', 'jpg', 'jpeg', 'gif'];

const uploadFile = ({ file = '' }, validExtensions = extensions, folder = '') => {

    return new Promise((resolve, reject) => {
        const nameResume = file.name.split('.');
        const extensionFile = nameResume[nameResume.length - 1];

        // Permitir extensiones válidas
        if(!validExtensions.includes(extensionFile)){
            return reject(`La extensión ${ extensionFile } no es permitada, solo son permitidos: ${ validExtensions }`);
        }

        const tempName = uuidv4() + '.' + extensionFile;
        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName);
        
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve(tempName);
        });
    });
}

module.exports = {
    uploadFile,
}
