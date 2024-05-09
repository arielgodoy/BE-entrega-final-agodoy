const { connect } = require("mongoose");
const dotenv = require('dotenv');
const { program } = require("../utils/commander.js");
const { logger } = require("../utils/logger.js");

const getMode = () => {
    const options = program.opts();
    if (options && options.mode) {
        return options.mode;
    } else {
        return 'development';
    }
};

let mode = getMode();

dotenv.config({
    path: mode === 'production' ? `${__dirname}/../.env.production` : `${__dirname}/../.env.development`
});

const configObject = {
    PORT: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    gh_client_id: process.env.GITHUB_CLIENTID,
    gh_client_secret: process.env.GITHUB_CLIENT_SECRET,
    gmail_pass_app: process.env.GMAIL_PASSAPP,
    gmail_user: process.env.GMAIL_USERAPP,
    modo_ejecucion: process.env.MODO_EJECUCION
};

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URL);
        logger.info('Base de datos conectada');
    } catch (err) {
        logger.error('Error al conectar con la base de datos:', err);
    }
};

// Verificar las variables de entorno cargadas
logger.info('Variables de entorno cargadas:', configObject)


module.exports = {
    configObject,
    connectDB
};
