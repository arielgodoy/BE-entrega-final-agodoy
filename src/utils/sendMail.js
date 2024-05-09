const nodemailer = require('nodemailer');
const { configObject } = require('../config/config.js');

const transport = nodemailer.createTransport({
    
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.GMAIL_USERAPP || 'arielgodoy@gmail.com',
        pass: configObject.GMAIL_PASSAPP || 'twxc ocxe dgyu hbrc'
    }
})


exports.sendMail = async (destino, subject, html) => {
    
    try {        
        const info = await transport.sendMail({
            from: 'Este mail lo envia <arielgodoy@gmail.com>',
            to: destino,
            subject,
            html,
            attachments: [
                {
                    filename: 'attment.txt',
                    path: './src/public/images/attment.txt',
                    cid: 'logo'
                }
            ]
        });
        console.log(info);
        return info;
    } catch (error) {
        console.error(error);
        throw error; // Asegúrate de manejar el error adecuadamente en el lugar donde llames a esta función
    }
};
