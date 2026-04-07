// FULL STACK (Frontend + Firebase Integration in one file for demo)
// You will later split into files in real project
'use client';

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// 🔥 FIREBASE CONFIG (Replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [adminMode, setAdminMode] = useState(false);

  // 🔐 AUTH
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadCart(u.uid);
    });
    loadProducts();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setCart([]);
  };

  // 🛍️ PRODUCTS
  const loadProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const addProduct = async (p) => {
    await addDoc(collection(db, "products"), p);
    loadProducts();
  };

  // 🛒 CART
  const addToCart = async (product) => {
    if (!user) return alert("Login first");
    await addDoc(collection(db, "cart"), {
      uid: user.uid,
      ...product,
    });
    loadCart(user.uid);
  };

  const loadCart = async (uid) => {
    const q = query(collection(db, "cart"), where("uid", "==", uid));
    const snap = await getDocs(q);
    setCart(snap.docs.map((d) => d.data()));
  };

  // 💰 PRICING
  const total = cart.reduce((s, i) => s + i.price, 0);
  const delivery = total >= 1500 || cart.length >= 3 ? 0 : 100;
  const discount = total * 0.1;
  const finalTotal = total + delivery - discount;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* NAVBAR */}
      <div className="flex justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-pink-600">Fashion Store</h1>
        <div className="flex gap-3">
          {user ? (
            <>
              <span>{user.displayName}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={login}>Login with Google</button>
          )}
          <button onClick={() => setAdminMode(!adminMode)}>Admin</button>
        </div>
      </div>

      {/* ADMIN PANEL */}
      {adminMode && (
        <AdminPanel addProduct={addProduct} />
      )}

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded shadow">
            <img src={p.image} className="rounded" />
            <h2>{p.name}</h2>
            <p className="text-pink-600">₹{p.price}</p>
            <button
              onClick={() => addToCart(p)}
              className="bg-pink-500 text-white px-2 py-1 rounded w-full"
            >
              Add to Bag
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow">
        <p>Items: {cart.length}</p>
        <p>Subtotal: ₹{total}</p>
        <p>Delivery: ₹{delivery}</p>
        <p>Discount: -₹{discount.toFixed(0)}</p>
        <p className="font-bold">Total: ₹{finalTotal.toFixed(0)}</p>
      </div>
    </div>
  );
}

// 🧑‍💻 ADMIN COMPONENT
function AdminPanel({ addProduct }) {
  const [form, setForm] = useState({ name: "", price: "", image: "" });

  const submit = () => {
    if (!form.name || !form.price) return alert("Fill all");
    addProduct({ ...form, price: Number(form.price) });
    setForm({ name: "", price: "", image: "" });
  };

  return (
    <div className="p-4 bg-yellow-100">
      <h2 className="font-bold">Admin Upload</h2>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-1 mr-2"
      />
      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="border p-1 mr-2"
      />
      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
        className="border p-1 mr-2"
      />
      <button onClick={submit} className="bg-black text-white px-2 py-1">
        Upload
      </button>
    </div>
  );
}
