// @ts-nocheck
import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado para el formulario
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Obtener productos del servidor
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/products');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Añadir un nuevo producto
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const addedProduct = await response.json();
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', price: 0 }); // Resetear formulario
    } catch (err) {
      setError('Error al añadir el producto');
      console.error('Error:', err);
    }
  };

  // Iniciar edición de un producto
  const startEdit = (product) => {
    setEditingProduct(product);
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingProduct(null);
  };

  // Actualizar un producto
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingProduct)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const updatedProduct = await response.json();
      
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      
      setEditingProduct(null); // Salir del modo edición
    } catch (err) {
      setError('Error al actualizar el producto');
      console.error('Error:', err);
    }
  };

  // Eliminar un producto
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error('Error:', err);
    }
  };

  // Manejar cambios en el formulario de nuevo producto
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  return (
    <view className="product-manager">
      <text className="title">Gestor de Productos</text>
      
      {error && <view className="error-message"><text>{error}</text></view>}
      
      {/* Formulario para añadir producto */}
      <view className="product-form">
        <text className="subtitle">Añadir Nuevo Producto</text>
        <view className="form" onSubmit={handleAddProduct}>
          <view className="form-group">
            <text className="label">Nombre</text>
            <input 
              type="text" 
              name="name" 
              value={newProduct.name} 
              onChange={handleNewProductChange} 
              required 
            />
          </view>
          <view className="form-group">
            <text className="label">Precio</text>
            <input 
              type="number" 
              name="price" 
              value={newProduct.price} 
              onChange={handleNewProductChange} 
              min="0" 
              step="0.01" 
              required 
            />
          </view>
          <text className="btn-add" onClick={handleAddProduct}>Añadir Producto</text>
        </view>
      </view>
      
      {/* Lista de productos */}
      <view className="products-list">
        <text className="subtitle">Lista de Productos</text>
        {loading ? (
          <text>Cargando productos...</text>
        ) : products.length === 0 ? (
          <text>No hay productos disponibles</text>
        ) : (
          <view className="product-grid">
            <view className="product-header">
              <view className="product-cell id"><text>ID</text></view>
              <view className="product-cell name"><text>Nombre</text></view>
              <view className="product-cell price"><text>Precio</text></view>
              <view className="product-cell actions"><text>Acciones</text></view>
            </view>
            {products.map(product => (
              <view className="product-row" key={product.id}>
                <view className="product-cell id"><text>{product.id}</text></view>
                <view className="product-cell name"><text>{product.name}</text></view>
                <view className="product-cell price"><text>${product.price.toFixed(2)}</text></view>
                <view className="product-cell actions">
                  <text onClick={() => startEdit(product)} className="btn-edit">Editar</text>
                  <text onClick={() => handleDeleteProduct(product.id)} className="btn-delete">Eliminar</text>
                </view>
              </view>
            ))}
          </view>
        )}
      </view>
      
      {/* Modal de edición */}
      {editingProduct && (
        <view className="edit-modal">
          <view className="modal-content">
            <text className="subtitle">Editar Producto</text>
            <view className="form" onSubmit={handleUpdateProduct}>
              <view className="form-group">
                <text className="label">Nombre</text>
                <input 
                  type="text" 
                  name="name" 
                  value={editingProduct.name} 
                  onChange={handleEditChange} 
                  required 
                />
              </view>
              <view className="form-group">
                <text className="label">Precio</text>
                <input 
                  type="number" 
                  name="price" 
                  value={editingProduct.price} 
                  onChange={handleEditChange} 
                  min="0" 
                  step="0.01" 
                  required 
                />
              </view>
              <view className="buttons">
                <text onClick={handleUpdateProduct} className="btn-save">Guardar</text>
                <text onClick={cancelEdit} className="btn-cancel">Cancelar</text>
              </view>
            </view>
          </view>
        </view>
      )}
    </view>
  );
}
