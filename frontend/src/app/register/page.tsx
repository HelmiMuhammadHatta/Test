'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/register', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      
      alert('Registrasi Berhasil! Silakan Login.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1f3d47] via-[#0d1d23] to-[#09141a] text-white p-6">
      {/* Header / Back Button */}
      <div className="flex items-center mb-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold ml-4 mb-10">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            required
            className="w-full bg-[#ffffff0a] border border-[#ffffff1a] rounded-lg p-4 outline-none focus:border-cyan-500 transition-all"
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Create Username"
            required
            className="w-full bg-[#ffffff0a] border border-[#ffffff1a] rounded-lg p-4 outline-none focus:border-cyan-500 transition-all"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            required
            className="w-full bg-[#ffffff0a] border border-[#ffffff1a] rounded-lg p-4 outline-none focus:border-cyan-500 transition-all"
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="w-full bg-[#ffffff0a] border border-[#ffffff1a] rounded-lg p-4 outline-none focus:border-cyan-500 transition-all"
            onChange={handleChange}
          />

          {error && <p className="text-red-400 text-sm ml-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#62cdcb] to-[#4599db] text-white font-bold py-4 rounded-lg mt-6 shadow-[0_10px_20px_-5px_rgba(69,153,219,0.3)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div className="mt-12 text-center text-sm">
          <p className="text-gray-400">
            Have an account?{' '}
            <Link href="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-[#94783E] via-[#F3EDA4] to-[#F8FAE5] font-medium border-b border-[#F3EDA4]">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}