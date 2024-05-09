/* This code snippet is setting up a route in an Express application. It creates a router using
`express.Router()` and defines a GET endpoint at the path '/logger'. When a request is made to this
endpoint, it logs a warning message using `req.logger.warning()` and sends a response with the
message 'Hola Mundo'. Finally, the router is exported to be used in the main Express application
file. */
const express = require('express');
const router = express.Router();
const logger  = require('../utils/logger.js')
const { faker } = require('@faker-js/faker')



//EP de test de Logger
router.get('/logger',(req,res)=>{
    req.logger.fatal("Mensaje de Fatal")    
    req.logger.error("Mensaje de error")    
    req.logger.warning("Mensaje de warning")    
    req.logger.info("Mensaje de info")    
    req.logger.debug("Mensaje de debug")    
    req.logger.http("Mensaje de http")    

    res.send({ message: 'revise Mensajes en la Consola'});
});


// http://localhost:8080/pruebas/compleja

// artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/simple" -o simple.json
// artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/compleja" -o compleja.json

// artillery run config.yaml --output testPerformance.json

// artillery report testPerformance.json -o testResults.html

router.get('/simple', (req, res) => {
    let sum = 0
    for (let i = 0; i < 1000000; i++) {
        sum += i        
    }
    res.send(`La suma es ${sum}`)
})


router.get('/compleja', (req, res) => {
    let sum = 0
    for (let i = 0; i < 5e8; i++) {
        sum += i        
    }
    res.send(`La suma es ${sum}`)
})


router.get('/user', (req, res) =>{    
    let first_name = faker.person.firstName()
    let last_name  = faker.person.lastName()
    let email      = faker.internet.email()
    let password   = faker.internet.password()
    res.send({
        first_name,
        last_name, 
        email,
        password
    })


})









module.exports = router;  



