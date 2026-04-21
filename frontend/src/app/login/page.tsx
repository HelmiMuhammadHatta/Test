'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import api from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loginToast = toast.loading('Authenticating...');

    try {
      const res = await api.post('/api/login', formData);
      localStorage.setItem('token', res.data.access_token);
      toast.success('Welcome back!', { id: loginToast });
      router.push('/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed', { id: loginToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1f3d47] via-[#0d1d23] to-[#09141a] text-white p-8">
      <Toaster position="top-center" />
      
      {/* Header / Back */}
      <div className="max-w-md mx-auto w-full mb-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium hover:text-[#62cdcb] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg> Back
        </button>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-8 px-2 tracking-tight">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Username/Email"
            required
            className="w-full bg-[#ffffff0a] border border-[#ffffff1a] rounded-xl p-4 outline-none focus:border-[#62cdcb]/50 transition-all text-sm placeholder:text-gray-500"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              required
              className="w-full bg-[#ffffff0a] border border-[#ffffff1a] rounded-xl p-4 outline-none focus:border-[#62cdcb]/50 transition-all text-sm placeholder:text-gray-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#62cdcb]"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#62cdcb] to-[#4599db] text-white font-bold py-4 rounded-xl mt-6 shadow-lg shadow-[#62cdcb]/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? 'PLEASE WAIT...' : 'Login'}
          </button>
        </form>

        <div className="mt-12 text-center text-sm">
          <span className="text-gray-400">No account? </span>
          <Link href="/register" className="text-[#62cdcb] border-b border-[#62cdcb]/30 font-medium hover:text-[#4599db] transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}