import React, { useEffect, useState } from 'react';
import './RawMaterialStockLevel.css';

const RawMaterialStockLevel = () => {
    const [rawMaterials, setRawMaterials] = useState([]);

    useEffect(() => {
        const fetchRawMaterials = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/raw-material-stock-level');
                if (!response.ok) {
                    throw new Error('Failed to fetch raw material stock levels');
                }
                const data = await response.json();
                setRawMaterials(data);
            } catch (error) {
                console.error('Error fetching raw material stock levels:', error);
            }
        };

        fetchRawMaterials();
    }, []);

    return (
        <div className="raw-material-stock-level-container">
            <h1>Raw Material Stock Level</h1>
            <table className="raw-material-stock-level-table">
                <thead>
                    <tr>
                        <th>Raw Material</th>
                        <th>Quantity</th>
                        <th>Reorder Point</th>
                    </tr>
                </thead>
                <tbody>
                    {rawMaterials.map((material) => (
                        <tr key={material.id}>
                            <td>{material.name}</td>
                            <td>{material.quantity}</td>
                            <td>{material.reorderPoint}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RawMaterialStockLevel;