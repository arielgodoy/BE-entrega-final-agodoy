const { Command } = require('commander');
const program = new Command()
program
    .option('-d', 'Variables para debug', false) // --version forma larga ->  -v forma corta npm i npm install
    .option('-p <port>', 'puerto del servidor')
    .option('-u <user>', 'usuario del proceso')
    .option('--mode <mode>', 'especifíca el entorno de ejecución de nuestro BackEnd') // development, testing, production
    .option('-l, --letter [letter...]', 'specify letter')  // modo del entorno    
program.parse()
module.exports = { program };
