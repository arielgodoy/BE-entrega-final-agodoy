const { Router } = require('express');
const { sendMail } = require('../utils/sendMail.js');

const router = Router();

router.get('/sendmail', async (req, res) => {
    const userenvio ={
        email:'arielgodoy@gmail.com',
        first_name:'Ariel',
        last_name:'Godoy',
        subject:'Test'
    }
    const to = userenvio.email;
    const subject = 'mail de prueba';
    const html = `<h1>Hola ${userenvio.first_name} ${userenvio.last_name}</h1> <p>Este es un mail de prueba</p>`;
    
    try {
        const info = await sendMail(to, subject, html);
        console.log(info);
        res.json(info);
    } catch (error) {
        console.error(error);
        res.status(500).json({status:'error', message:'Error interno del servidor'});
    }
});

module.exports = router;
