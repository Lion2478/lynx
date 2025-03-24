const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // Cambiado de 3001 a 3002 para evitar conflictos

// Middleware para CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Middleware para analizar JSON
app.use(express.json());

// Rutas de productos
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: "¡Bienvenido a la API del servidor Lynx!",
    endpoints: {
      productos: "/api/products",
      productosPorId: "/api/products/:id"
    }
  });
});

// Mantenemos la funcionalidad de páginas de productos dinámicas
let productPages = new Map();

app.post('/api/generate-product-page', (req, res) => {
    try {
        const { products } = req.body;
        
        if (!Array.isArray(products)) {
            return res.status(400).json({ 
                error: 'Invalid products data',
                data: { url: '' }
            });
        }

        const pageId = Date.now().toString();
        productPages.set(pageId, products);
        
        const url = `http://localhost:${PORT}/products/${pageId}`;
        res.json({ data: { url } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Server error',
            data: { url: '' }
        });
    }
});

app.get('/products/:pageId', (req, res) => {
    const { pageId } = req.params;
    const products = productPages.get(pageId);
    
    if (!products) {
        return res.status(404).send('Página no encontrada');
    }

    const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Lista de Productos</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                    }
                    .product {
                        background: white;
                        border: 1px solid #ddd;
                        padding: 15px;
                        margin: 10px 0;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .product h3 {
                        margin: 0 0 10px 0;
                        color: #2c3e50;
                    }
                    .price {
                        color: #27ae60;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Lista de Productos</h1>
                    ${products.map(product => `
                        <div class="product">
                            <h3>${product.name}</h3>
                            <p class="price">Precio: $${product.price}</p>
                        </div>
                    `).join('')}
                </div>
            </body>
        </html>
    `;
    
    res.send(html);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
