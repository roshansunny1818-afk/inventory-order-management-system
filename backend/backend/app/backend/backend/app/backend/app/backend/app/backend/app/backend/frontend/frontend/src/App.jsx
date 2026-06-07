import React, { useState, useEffect } from 'react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Form States
  const [prodForm, setProdForm] = useState({ sku: '', name: '', price: '', stock: '' });
  const [custForm, setCustForm] = useState({ name: '', email: '' });
  const [orderForm, setOrderForm] = useState({ customer_id: '', product_id: '', quantity: 1 });
  
  const [msg, setMsg] = useState({ text: '', isErr: false });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchAll = async () => {
    try {
      const pRes = await fetch(`${API_URL}/products/`);
      const cRes = await fetch(`${API_URL}/customers/`);
      const oRes = await fetch(`${API_URL}/orders/`);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCustomers(await cRes.json());
      if (oRes.ok) setOrders(await oRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const showMsg = (text, isErr = false) => {
    setMsg({ text, isErr });
    setTimeout(() => setMsg({ text: '', isErr: false }), 5000);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prodForm, price: parseInt(prodForm.price) * 100, stock: parseInt(prodForm.stock) })
    });
    const data = await res.json();
    if (res.ok) { showMsg("Product added!"); setProdForm({ sku: '', name: '', price: '', stock: '' }); fetchAll(); }
    else { showMsg(data.detail || "Error adding product", true); }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/customers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(custForm)
    });
    const data = await res.json();
    if (res.ok) { showMsg("Customer registered!"); setCustForm({ name: '', email: '' }); fetchAll(); }
    else { showMsg(data.detail || "Error registering customer", true); }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: parseInt(orderForm.customer_id), product_id: parseInt(orderForm.product_id), quantity: parseInt(orderForm.quantity) })
    });
    const data = await res.json();
    if (res.ok) { showMsg("Order placed successfully!"); setOrderForm({ customer_id: '', product_id: '', quantity: 1 }); fetchAll(); }
    else { showMsg(data.detail || "Order execution failed", true); }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#1f2937' }}>Inventory & Order Management Dashboard</h1>
      
      {msg.text && (
        <div style={{ padding: '12px', margin: '16px auto', maxWidth: '600px', borderRadius: '4px', textAlign: 'center', backgroundColor: msg.isErr ? '#fde8e8' : '#def7ec', color: msg.isErr ? '#9b1c1c' : '#03543f' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Product Form */}
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>Add Product</h3>
          <form onSubmit={handleCreateProduct}>
            <input placeholder="SKU" required style={{ width: '100%', marginBottom: '8px', padding: '6px' }} value={prodForm.sku} onChange={e => setProdForm({...prodForm, sku: e.target.value})} />
            <input placeholder="Product Name" required style={{ width: '100%', marginBottom: '8px', padding: '6px' }} value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
            <input placeholder="Price ($)" type="number" required style={{ width: '100%', marginBottom: '8px', padding: '6px' }} value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
            <input placeholder="Initial Stock" type="number" required style={{ width: '100%', marginBottom: '12px', padding: '6px' }} value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Product</button>
          </form>
        </div>

        {/* Customer Form */}
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>Register Customer</h3>
          <form onSubmit={handleCreateCustomer}>
            <input placeholder="Full Name" required style={{ width: '100%', marginBottom: '8px', padding: '6px' }} value={custForm.name} onChange={e => setCustForm({...custForm, name: e.target.value})} />
            <input placeholder="Email Address" type="email" required style={{ width: '100%', marginBottom: '12px', padding: '6px' }} value={custForm.email} onChange={e => setCustForm({...custForm, email: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Customer</button>
          </form>
        </div>

        {/* Order Form */}
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>Place Order</h3>
          <form onSubmit={handleCreateOrder}>
            <input placeholder="Customer ID" type="number" required style={{ width: '100%', marginBottom: '8px', padding: '6px' }} value={orderForm.customer_id} onChange={e => setOrderForm({...orderForm, customer_id: e.target.value})} />
            <input placeholder="Product ID" type="number" required style={{ width: '100%', marginBottom: '8px', padding: '6px' }} value={orderForm.product_id} onChange={e => setOrderForm({...orderForm, product_id: e.target.value})} />
            <input placeholder="Quantity" type="number" min="1" required style={{ width: '100%', marginBottom: '12px', padding: '6px' }} value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit Order</button>
          </form>
        </div>
      </div>

      {/* Data Visualization Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
          <h4>Product Inventory Status</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th>ID</th><th>SKU</th><th>Name</th><th>Price</th><th>In Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td>{p.id}</td><td>{p.sku}</td><td>{p.name}</td><td>${(p.price / 100).toFixed(2)}</td><td><strong>{p.stock}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
          <h4>Processed System Orders</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th>Order ID</th><th>Customer ID</th><th>Product ID</th><th>Qty Ordered</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td>{o.id}</td><td>{o.customer_id}</td><td>{o.product_id}</td><td>{o.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
