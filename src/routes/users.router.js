const express = require('express');
const UserDaoMongo = require('../dao/usersDaoMongo.js')
const userDao = new UserDaoMongo(); // Crear una instancia de UserDaoMongo

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await userDao.get(); // Obtener todos los usuarios
        if (users && users.length > 0) {
            return res.status(200).json({ data: users });
        } else {
            return res.status(404).send("No se encontraron usuarios");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
});


router.get('/:uid', async (req, res) => {
    let uid = req.params.uid;
    try {
        const user = await userDao.getBy({ '_id': uid }); // Obtener un usuario por ID
        if (!user) {        
            return res.status(404).send(`El usuario con id=${uid} no existe`);
        } else {
            return res.status(200).json({ data: user });
        }
    } catch (error) {       
        console.log(error);
        return res.status(500).send("Error al obtener el usuario");             
    }
});

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;       

        // Validar campos obligatorios
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send("Los campos first_name, last_name, email y password son obligatorios");
        }
        const existingUser = await userDao.getBy({ 'email': email });
        if (existingUser) {
            return res.status(400).send("El usuario ya existe"); // Devolver un error si el usuario ya existe
        }
        // Crear un nuevo usuario utilizando el modelo
        const newUser = {
            first_name,
            last_name,
            email,
            password,
            role: 'user' // Definir el rol como 'user' por defecto
        };

        // Guardar el nuevo usuario en la base de datos
        const result = await userDao.create(newUser)        
        return res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
});

router.put('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const userUpdate = req.body;
        const result = await userDao.update(uid, userUpdate);
        return res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
});

router.delete('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await userDao.delete(uid);
        return res.status(200).json({ status: "success", payload: result });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;
