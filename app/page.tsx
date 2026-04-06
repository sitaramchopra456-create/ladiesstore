// Next.js (App Router) E-commerce Template for Ladies Fashion Store
// Features:
// - Categories: Kurtis, UGs, Artificial Jewellery, Hair Accessories
// - Admin upload panel (simple local state demo; can connect DB later)
// - Product listing with price + ₹100 delivery auto-added
// - Free delivery for 3+ items OR order >= ₹1500
// - Payment page with Paytm QR upload

// 1. Install:
// npx create-next-app@latest ladies-store
// cd ladies-store
// npm install
// npm run dev

// Replace app/page.js with below:

'use client';
import { useState } from 'react';

const categories = ['Kurtis', 'UGs', 'Jewellery', 'Hair Accessories'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '' });

  const addProduct = () => {
    setProducts([...products, { ...form, id: Date.now() }]);
    setForm({ name: '', price: '', category: '', image: '' });
  };

  const addToCart = (p) => {
    setCart([...cart, p]);
  };

  const totalAmount = () => {
    let total = cart.reduce((sum, item) => sum + Number(item.price), 0);
    if (cart.length < 3 && total < 1500) {
      total += 100;
    }
    return total;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ladies Fashion Store</h1>

      {/* Admin Panel */}
      <div className="border p-4 mb-6">
        <h2 className="font-bold">Admin Upload</h2>
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="border m-1"/>
        <input placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} className="border m-1"/>
        <input placeholder="Image URL" value={form.image} onChange={(e)=>setForm({...form,image:e.target.value})} className="border m-1"/>
        <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="border m-1">
          <option>Select Category</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={addProduct} className="bg-blue-500 text-white p-2 m-1">Add Product</button>
      </div>

      {/* Product Listing */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <div key={p.id} className="border p-2">
            <img src={p.image} className="h-40 w-full object-cover" />
            <h3>{p.name}</h3>
            <p>₹{p.price} + ₹100 delivery</p>
            <button onClick={()=>addToCart(p)} className="bg-green-500 text-white p-1 mt-2">Buy</button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="mt-6">
        <h2 className="font-bold">Cart ({cart.length})</h2>
        <p>Total: ₹{totalAmount()}</p>
        <a href="/payment" className="bg-black text-white p-2 inline-block mt-2">Go to Payment</a>
      </div>
    </div>
  );
}

// 2. Create app/payment/page.js

export function Payment() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Payment Page</h1>
      <p>Scan Paytm QR to Pay</p>
      <img src="/paytm-qr.png" className="w-64" />
    </div>
  );
}

// Notes:
// - Upload your Paytm QR as /public/paytm-qr.png
// - For 500 images, use cloud (Cloudinary/Firebase) instead of manual URL
// - For real admin login, connect Firebase/Auth
// - Deploy using Vercel: vercel.com → import project

