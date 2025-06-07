import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './GenerateInvoice.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GenerateInvoice = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [vat] = useState(0.5);
    const [subtotal, setSubtotal] = useState(0);
    const [vatAmount, setVatAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showDownload, setShowDownload] = useState(false);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pdfType, setPdfType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/customers`);
                const data = await response.json();
                setCustomers(Array.isArray(data) ? data : []);
            } catch (error) {
                setCustomers([]);
            }
        };
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                setProducts([]);
            }
        };
        fetchCustomers();
        fetchProducts();
    }, []);

    useEffect(() => {
        // Recalculate totals whenever selectedProducts changes
        const sub = selectedProducts.reduce((sum, item) => sum + (item.quantity * (item.product?.unit_price || 0)), 0);
        const vatVal = sub * vat / 100;
        setSubtotal(sub);
        setVatAmount(vatVal);
        setTotalAmount(sub + vatVal);
    }, [selectedProducts, vat]);

    const handleAddProduct = () => {
        setSelectedProducts([...selectedProducts, { product: '', quantity: 0 }]);
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...selectedProducts];
        if (field === 'product') {
            const selectedProduct = products.find(p => p.id === parseInt(value));
            updatedProducts[index][field] = selectedProduct || '';
        } else {
            updatedProducts[index][field] = value;
        }
        setSelectedProducts(updatedProducts);
    };

    const generateInvoicePDF = (status) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Bonnesante Medicals', 14, 15);
        doc.setFontSize(10);
        doc.text('Head Office: No 17A Isuofia/6B Peace Avenue, Federal Housing TransEkulu', 14, 22);
        doc.text('Bank Name: MONIEPOINT', 14, 27);
        doc.text('Account Name: BONNESANTE MEDICALS', 14, 32);
        doc.text('Account Number: 8259518195', 14, 37);
        doc.text('Bank Name: Access Bank', 14, 42);
        doc.text('Account Name: BONNESANTE MEDICALS', 14, 47);
        doc.text('Account Number: 1379643548', 14, 52);
        doc.setFontSize(12);
        doc.text(status === 'paid' ? 'Payment Receipt' : 'Invoice', 150, 15);
        doc.text(`Customer: ${customers.find(c => c.id === parseInt(selectedCustomer))?.name || ''}`, 14, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 60);
        const tableData = selectedProducts.map((item, idx) => [
            idx + 1,
            item.product?.name || '',
            item.quantity,
            item.product?.unit_price?.toFixed(2) || '0.00',
            ((item.quantity || 0) * (item.product?.unit_price || 0)).toFixed(2)
        ]);
        autoTable(doc, {
            head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
            body: tableData,
            startY: 70
        });
        let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 70 + tableData.length * 10;
        doc.text(`Subtotal: ₦${subtotal.toFixed(2)}`, 150, finalY + 10);
        doc.text(`VAT (${vat}%): ₦${vatAmount.toFixed(2)}`, 150, finalY + 16);
        doc.text(`Total: ₦${totalAmount.toFixed(2)}`, 150, finalY + 22);
        if (status === 'paid') {
            doc.setFontSize(14);
            doc.setTextColor(0, 128, 0);
            doc.text('PAID', 150, finalY + 32);
        }
        setPdfDoc(doc);
        setPdfType(status === 'paid' ? 'receipt' : 'invoice');
        setShowDownload(true);
    };

    // Helper to save invoice to backend
    const saveInvoiceToBackend = async (status) => {
        // Generate a simple invoice number (e.g., INV-YYYYMMDD-HHMMSS)
        const now = new Date();
        const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        // Prepare invoice payload
        const invoicePayload = {
            invoice_number: invoiceNumber,
            customer_name: customers.find(c => c.id === parseInt(selectedCustomer))?.name || '',
            total_amount: totalAmount,
            vat: vatAmount,
            status: status === 'paid' ? 'paid' : 'unpaid',
            items: selectedProducts.map(item => ({
                product_id: item.product?.id,
                quantity: item.quantity,
                price: item.product?.unit_price
            })),
            date: now.toISOString().split('T')[0] // Add date in YYYY-MM-DD format
        };
        try {
            const response = await fetch(`${API_BASE_URL}/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoicePayload)
            });
            if (!response.ok) {
                const err = await response.text();
                console.error('Failed to save invoice:', err);
            }
        } catch (err) {
            console.error('Error saving invoice:', err);
        }
    };

    const handleSubmit = async (status) => {
        await saveInvoiceToBackend(status);
        generateInvoicePDF(status);
    };

    const handleDownload = () => {
        if (pdfDoc) {
            // Format customer name and date for filename
            const customerName = customers.find(c => c.id === parseInt(selectedCustomer))?.name?.replace(/\s+/g, '_') || 'customer';
            const dateStr = new Date().toISOString().split('T')[0];
            const baseName = pdfType === 'receipt' ? 'payment_receipt' : 'invoice';
            const fileName = `${baseName}_${customerName}_${dateStr}.pdf`;
            pdfDoc.save(fileName);
            setShowDownload(false);
        }
    };

    return (
        <div className="generate-invoice-container">
            <h1>Generate Invoice</h1>
            <div className="company-details">
                <h2>Bonnesante Medicals</h2>
                <p>Head Office: No 17A Isuofia/6B Peace Avenue, Federal Housing TransEkulu</p>
                <p>Bank Name: MONIEPOINT</p>
                <p>Account Name: BONNESANTE MEDICALS</p>
                <p>Account Number: 8259518195</p>
                <p>Bank Name: Access Bank</p>
                <p>Account Name: BONNESANTE MEDICALS</p>
                <p>Account Number: 1379643548</p>
            </div>
            <form onSubmit={e => e.preventDefault()}>
                <label>
                    Customer:
                    <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        required
                    >
                        <option value="">Select a customer</option>
                        {customers.length === 0 && <option disabled>No customers found</option>}
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                </label>
                <p>
                    <a href="#" onClick={() => navigate('/register-customer')}>
                        Register a new customer
                    </a>
                </p>
                <div className="product-list">
                    {selectedProducts.map((item, index) => (
                        <div key={index} className="product-item">
                            <select
                                value={item.product?.id || ''}
                                onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                            >
                                <option value="">Select Product</option>
                                {products.length === 0 && <option disabled>No products found</option>}
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                placeholder="Quantity"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddProduct}>Add Product</button>
                </div>
                <p>Subtotal: ₦{subtotal.toFixed(2)}</p>
                <p>VAT ({vat}%): ₦{vatAmount.toFixed(2)}</p>
                <p><b>Total Amount: ₦{totalAmount.toFixed(2)}</b></p>
                <button type="button" onClick={() => handleSubmit('unpaid')}>Submit as Unpaid (Generate Invoice PDF)</button>
                <button type="button" onClick={() => handleSubmit('paid')}>Submit as Paid (Generate Payment Receipt PDF)</button>
            </form>
            {showDownload && (
                <div className="pdf-download-modal">
                    <p>{pdfType === 'receipt' ? 'Payment receipt' : 'Invoice'} generated!</p>
                    <button onClick={handleDownload}>Download PDF</button>
                </div>
            )}
        </div>
    );
};

export default GenerateInvoice;