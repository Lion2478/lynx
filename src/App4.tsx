// @ts-nocheck
import React, { useCallback, useState } from 'react'
import './App4.css'
import { ProductManager } from './components/ProductManager'
import './components/ProductManager.css'

export function NewScreen() {
    const [productUrl, setProductUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('generator') // 'generator' o 'manager'

    // Lista de ejemplo de productos - puedes modificar esto según tus necesidades
    const products = [
        { name: "Producto 1", price: 100 },
        { name: "Producto 2", price: 200 },
        { name: "Producto 3", price: 300 }
    ]

    const handleGenerateProductPage = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:3001/api/generate-product-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ products })
            });
            
            const result = await response.json();
            
            if (result.error) {
                setError(result.error);
                return;
            }
            
            setProductUrl(result.data.url);
        } catch (err) {
            setError('Error al conectar con el servidor');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, [products]);

    const generateQRCode = (url) => {
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
        return qrCodeUrl;
    }

    return (
        <view className="body">
            <view className="content">
                <view className="header">
                    <text className="title">Gestión de Productos Lynx</text>
                    <view className="tabs">
                        <text 
                            className={`tab ${activeTab === 'generator' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('generator')}
                        >
                            Generador de QR
                        </text>
                        <text 
                            className={`tab ${activeTab === 'manager' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('manager')}
                        >
                            Gestor de Productos
                        </text>
                    </view>
                </view>
                
                {activeTab === 'generator' ? (
                    <>
                        <view className="square-container">
                            <view className="square">
                                {loading ? (
                                    <text>Generando página...</text>
                                ) : error ? (
                                    <text className="error-text">{error}</text>
                                ) : productUrl && (
                                    <view>
                                        <text className="url-text">{productUrl}</text>
                                        <view style={{ display: 'flex', justifyContent: 'center' }}>
                                            <image 
                                                src={generateQRCode(productUrl)} 
                                                alt="Código QR" 
                                                style={{ width: '200px', height: '200px' }}
                                            />
                                        </view>
                                    </view>
                                )}
                            </view>
                        </view>
                        <view className="text-container">
                            <text className="description-text">
                                {loading ? 'Procesando...' : 
                                error ? 'Hubo un error al generar la URL' :
                                productUrl ? 'URL generada para ver los productos' : 
                                'Haz clic en el botón para generar una página de ejemplo con productos'}
                            </text>
                            {!loading && !productUrl && !error && (
                                <view className="button-container">
                                    <text className="action-button" onClick={handleGenerateProductPage}>
                                        Generar Página de Productos
                                    </text>
                                </view>
                            )}
                        </view>
                    </>
                ) : (
                    <ProductManager />
                )}
            </view>
        </view>
    )
}

export default function App4() {
    return (
        <view className="App">
            <NewScreen />
        </view>
    )
}