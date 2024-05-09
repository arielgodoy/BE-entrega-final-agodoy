const winston = require('winston');
const { program } = require("./commander.js");

const getMode = () => {
    const options = program.opts();
    if (options && options.mode) {
        return options.mode;
    } else {
        return 'development';
    }
};
const cutomLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
        http: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'green'

    }
}

let mode = getMode();
const logLevel = mode === 'production' ? 'info' : 'debug';
const logger = winston.createLogger({
    levels: cutomLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: logLevel, //iniciamos desde el nivel de info si estamos en production, si no desde debug            
            format: winston.format.combine(
                winston.format.colorize({ colors: cutomLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error', //registra en el log desde  desde el nivel 'error' en delante
            format: winston.format.simple(),
        })
    ]
})

const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
};

module.exports = {
    addLogger,
    logger // Exporta el objeto logger directamente para usar sin midleware
};
