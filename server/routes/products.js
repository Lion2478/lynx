const express = require('express');
const router = express.Router();

// Datos de ejemplo (productos)
let products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Smartphone', price: 800 },
];

// Obtener todos los productos
router.get('/', (req, res) => {
    res.json(products);
});

// Obtener un producto por ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Producto no encontrado');
    res.json(product);
});

// Crear un nuevo producto
router.post('/', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Producto no encontrado');
    product.name = req.body.name;
    product.price = req.body.price;
    res.json(product);
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.send('Producto eliminado');
});

module.exports = router;
