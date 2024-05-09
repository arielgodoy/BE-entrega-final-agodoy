const express = require('express');
const ProductDaoMongo = require('../dao/ProductDaoMongo.js');
const productDaoMongo = new ProductDaoMongo();

const router = express.Router();
router
.get('/', async (req, res) => {
    try {
        //const limit = parseInt(req.query.limit) || null;
        const limit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : null;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 100;
        const sort = req.query.sort || null;
        const category = req.query.category || null;
        const availability = req.query.availability || null;        
        const result = await productDaoMongo.get({
            limit,
            page,
            pageSize,
            sort,
            category,
            availability,
        });

        const totalPages = Math.ceil(result.totalItems / pageSize);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        const response = {
            status: 'success',
            payload: result.products,
            totalPages: totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? `${req.originalUrl}?page=${page - 1}&pageSize=${pageSize}` : null,
            nextLink: hasNextPage ? `${req.originalUrl}?page=${page + 1}&pageSize=${pageSize}` : null,
        };

        res.json(result.products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
})

.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    
    try {
        const result = await productDaoMongo.getby({_id: id});

        if (result.product) {
            res.json(result.product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
})

.post('/', async (req, res) => {
    try {
        const products = req.body;
        const results = [];

        for (const product of products) {
            const { title, price, description, category, image, rating, code, stock, status } = product;
            const result = await productDaoMongo.create(title, price, description, category, image, rating, code, stock, status);
            results.push(result);
        }

        res.json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})


.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;
    const result = await productDaoMongo.update(productId, updatedProductData);

    if (result.success) {
        res.json({ message: `Producto con ID ${productId} actualizado con éxito.`, updatedProduct: result.updatedProduct });
    } else {
        res.status(400).json({ error: result.message });
    }
})

.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        // Esperamos a que se resuelva la promesa devuelta por delete
        const result = await productDaoMongo.delete(productId);
        if (result.success) {
            res.json({ message: `Producto con ID ${productId} eliminado con éxito.` });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

   



module.exports = router;  

