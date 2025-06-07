import React, { useEffect, useState } from 'react';
import './ProductionConsole.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductionConsole = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantityToProduce, setQuantityToProduce] = useState(0);
    const [requiredMaterials, setRequiredMaterials] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                setProducts(await response.json());
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const calculateMaterials = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/production-requirements/${selectedProduct}`);
            if (!response.ok) {
                throw new Error('Failed to fetch production requirements');
            }
            const requirements = await response.json();
            const calculatedMaterials = requirements.map((req) => ({
                rawMaterial: req.rawMaterial,
                quantityNeeded: req.quantity_per_unit * quantityToProduce
            }));
            setRequiredMaterials(calculatedMaterials);
        } catch (error) {
            console.error('Error calculating materials:', error);
        }
    };

    const handleApproveAndExport = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/approve-production`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId: selectedProduct, quantity: quantityToProduce })
            });

            if (!response.ok) {
                throw new Error('Failed to approve production');
            }

            alert('Production approved and exported as PDF!');
        } catch (error) {
            console.error('Error approving production:', error);
            alert('Failed to approve production. Please try again.');
        }
    };

    return (
        <div className="production-console-container">
            <h1>Production Console</h1>
            <form onSubmit={(e) => { e.preventDefault(); calculateMaterials(); }}>
                <label>
                    Product:
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Quantity to Produce:
                    <input
                        type="number"
                        value={quantityToProduce}
                        onChange={(e) => setQuantityToProduce(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Calculate Materials</button>
            </form>
            {requiredMaterials.length > 0 && (
                <div className="required-materials">
                    <h2>Required Materials</h2>
                    <ul>
                        {requiredMaterials.map((material, index) => (
                            <li key={index}>{material.rawMaterial.name}: {material.quantityNeeded}</li>
                        ))}
                    </ul>
                    <button onClick={handleApproveAndExport}>Approve and Export as PDF</button>
                </div>
            )}
        </div>
    );
};

export default ProductionConsole;