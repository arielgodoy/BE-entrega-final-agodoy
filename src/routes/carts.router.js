const express = require('express');
const CartManager = require('../dao/CartManagerMongo.js');
const cartManager = new CartManager(); // Instantiate CartManager
const router = express.Router();

router

    // traer todos los carritos
    .get('/', async (req, res) => {
        const carts = await cartManager.get();        
        if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
            // Si es una solicitud AJAX o acepta JSON, responder con datos JSON                
            res.send({
                status: 'success',
                payload: carts,
            });
        } else {                
            res.render('listacarritos', {
                title: 'Listacarritos',
                programa: 'Listacarritos',
                cartData: carts 
            });
        }        
    })


    // traer un carrito por id
    .get('/:cid', async (req, res) => {
        const { cid } = req.params;
        try {
            const cart = await cartManager.getBy({_id: cid});    
            // Verificar si es una solicitud AJAX (JSON) o HTML
            if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
                // Si es una solicitud AJAX o acepta JSON, responder con datos JSON                
                res.send({
                    status: 'success',
                    payload: cart,
                });
            } else {                
                res.render('vistacarrito', {
                    title: 'Vista Carrito',
                    programa: 'vistacarrito',
                    cartData: cart 
                });
            }
        } catch (error) {
            console.error('Error al obtener datos del carrito:', error);    
            // Manejar el error según sea necesario, por ejemplo, devolviendo un JSON en lugar de un HTML en caso de error
            res.status(500).json({ error: 'Error al obtener datos del carrito' });
        }
    })





    // crear un carrito
    .post('/', async (req, res) => {
        const newCart = req.body;
        const result = await cartManager.create(newCart);

        res.send({
            status: 'success',
            payload: result,
        });
    })

    
    // agregar un producto(s) a un carrito    
    .put('/:cid', async (req, res) => {
        //console.log("PUT agregar un producto(s) a un carrito")        
        const cid = req.params.cid;
        const updatedProducts = req.body.products;
        console.log(cid,updatedProducts)
        const result = await cartManager.update(cid, updatedProducts);
        res.send({
            status: 'success',
            payload: result,
        });
    })
     
    // aumenta cantidad de  un producto en el carrito
    .put('/:cid/products/:pid', async (req, res) => {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        const result = await cartManager.updateProductQuantity(cid, pid, quantity);

        res.send({
            status: 'success',
            payload: result,
        });
    })

    // Elimina un producto de un carrito
    .delete('/:cid/products/:pid', async (req, res) => {
        const { cid, pid } = req.params;
        console.log("elimina producto del carrito",cid,pid)

        const result = await cartManager.removeProductFromCart(cid, pid);
        //result = "elimnina producto del carrito"

        res.send({
            status: 'success',
            payload: result,
        });
    })

    // Elmimina un carrito
    .delete('/:cid', async (req, res) => {
        const { cid } = req.params;
        const result = await cartManager.emptyCart(cid);        
        res.send({
            status: 'success',
            payload: result,
        });
    });



module.exports = router;
