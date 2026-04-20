// Di dalam src/app/login/page.tsx
'use client';
import { useState } from 'react';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const res = await api.post('/api/login', formData);
        
        // 👇 PASANG CCTV DI SINI 👇
        console.log("ISI RESPONS BACKEND:", res.data);
        
        const tokenString = res.data.token || res.data.access_token;
        
        if (!tokenString) {
            alert("Sistem Error: Backend tidak mengirimkan token! Cek Console F12.");
            return;
        }

        localStorage.setItem('token', tokenString);
        alert("Login Berhasil!");
        router.push('/profile'); 
        } catch (err: any) {
        alert(err.response?.data?.message || "Login Gagal");
        }
    };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center p-8">
      <h1 className="text-2xl font-bold mb-8">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Email/Username" 
          className="bg-slate-800 p-4 rounded-lg outline-none"
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" 
          className="bg-slate-800 p-4 rounded-lg outline-none"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-lg mt-4 font-bold">
          Login
        </button>
      </form>
    </div>
  );
}