import React, { useEffect, useState } from 'react';
import './ProductionAnalysis.css';

const ProductionAnalysis = () => {
    const [productionData, setProductionData] = useState([]);

    useEffect(() => {
        const fetchProductionData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/production-analysis');
                if (!response.ok) {
                    throw new Error('Failed to fetch production data');
                }
                setProductionData(await response.json());
            } catch (error) {
                console.error('Error fetching production data:', error);
            }
        };

        fetchProductionData();
    }, []);

    return (
        <div className="production-analysis-container">
            <h1>Production Analysis</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Good Products</th>
                        <th>Damaged Products</th>
                        <th>Efficiency (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {productionData.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.date}</td>
                            <td>{entry.productName}</td>
                            <td>{entry.goodProducts}</td>
                            <td>{entry.damagedProducts}</td>
                            <td>{entry.efficiency}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductionAnalysis;