import React, { useState, useEffect } from 'react';
import './ProductStockIntake.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProductStockIntake = () => {
    const [products, setProducts] = useState([]);
    const [staff, setStaff] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        intakeDate: '',
        expiryDate: '',
        staffId: '',
        warehouseId: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('API did not return an array:', data);
                    setProducts([]); // Fallback to an empty array
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]); // Fallback to an empty array
            }
        };

        const fetchStaff = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/staff`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setStaff(data);
                } else {
                    console.error('API did not return an array:', data);
                    setStaff([]); // Fallback to an empty array
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
                setStaff([]); // Fallback to an empty array
            }
        };

        const fetchWarehouses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/warehouses`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setWarehouses(data);
                } else {
                    setWarehouses([]);
                }
            } catch (error) {
                setWarehouses([]);
            }
        };

        fetchProducts();
        fetchStaff();
        fetchWarehouses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/product-stock-intake`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            let data;
            try {
                data = await response.json();
            } catch (jsonErr) {
                data = {};
            }
            if (response.ok) {
                setMessage(typeof data.message === 'string' ? data.message : 'Product stock intake recorded successfully!');
                setFormData({ productId: '', quantity: '', intakeDate: '', expiryDate: '', staffId: '', warehouseId: '' });
                // Trigger global event for stock level update
                window.dispatchEvent(new Event('stockLevelUpdated'));
            } else {
                let errorMsg = 'Failed to record product stock intake.';
                if (data.detail) {
                    if (typeof data.detail === 'string') {
                        errorMsg = data.detail;
                    } else if (Array.isArray(data.detail)) {
                        errorMsg = data.detail.map(d => d.msg || JSON.stringify(d)).join('; ');
                    } else if (typeof data.detail === 'object') {
                        errorMsg = JSON.stringify(data.detail);
                    }
                }
                setMessage(errorMsg);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-stock-intake-container">
            <h1>Product Stock Intake</h1>
            <form onSubmit={handleSubmit} className="product-stock-intake-form">
                <label>
                    Select Product:
                    <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">--Select Product--</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Date of Intake:
                    <input
                        type="date"
                        name="intakeDate"
                        value={formData.intakeDate}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Expiry Date:
                    <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Intake Staff:
                    <select
                        name="staffId"
                        value={formData.staffId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">--Select Staff--</option>
                        {staff.map((staffMember) => (
                            <option key={staffMember.id} value={staffMember.id}>{staffMember.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Warehouse:
                    <select
                        name="warehouseId"
                        value={formData.warehouseId || ''}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">--Select Warehouse--</option>
                        {warehouses.map((wh) => (
                            <option key={wh.id} value={wh.id}>{wh.name} ({wh.location})</option>
                        ))}
                    </select>
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            </form>
            {message && <div className={message.includes('success') ? 'success' : 'error'} style={{marginTop:'1rem'}}>{message}</div>}
        </div>
    );
};

export default ProductStockIntake;