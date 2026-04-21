'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast'; // Notification pro
import api from '../../services/api';

// --- HELPER: LOGIKA AUTO ZODIAC & HOROSCOPE ---
const getZodiacAndHoroscope = (dateString: string) => {
  if (!dateString) return { zodiac: '', horoscope: '' };
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  let zodiac = "";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiac = 'Aries';
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiac = 'Taurus';
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiac = 'Gemini';
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiac = 'Cancer';
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiac = 'Leo';
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiac = 'Virgo';
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiac = 'Libra';
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiac = 'Scorpio';
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiac = 'Sagittarius';
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiac = 'Capricorn';
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiac = 'Aquarius';
  else zodiac = 'Pisces';

  const animals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];
  const horoscope = animals[year % 12];

  return { zodiac, horoscope };
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // State Form Lengkap (Termasuk Username, Email, Interests)
  const [editData, setEditData] = useState({ 
    username: '', email: '', birthday: '', zodiac: '', horoscope: '', interests: [] as string[]
  });
  const [tempInterest, setTempInterest] = useState(''); // Input sementara buat Interest

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await api.get('/api/getProfile', { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setEditData({
        username: res.data?.user?.username || '',
        email: res.data?.user?.email || '',
        birthday: res.data?.birthday ? res.data.birthday.split('T')[0] : '',
        zodiac: res.data?.zodiac || '',
        horoscope: res.data?.horoscope || '',
        interests: res.data?.interests || []
      });
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  // Logika tambah interest sebagai tag (pencet Enter)
  const addInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tempInterest.trim()) {
      e.preventDefault();
      if (!editData.interests.includes(tempInterest.trim())) {
        setEditData({ ...editData, interests: [...editData.interests, tempInterest.trim()] });
      }
      setTempInterest('');
    }
  };

  const removeInterest = (val: string) => {
    setEditData({ ...editData, interests: editData.interests.filter(i => i !== val) });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const updateToast = toast.loading('Syncing profile...');
    try {
      const token = localStorage.getItem('token');
      const payload = { ...editData, birthday: new Date(editData.birthday).toISOString() };
      const res = await api.post('/api/createProfile', payload, { headers: { Authorization: `Bearer ${token}` } });
      
      setUser(res.data); // SINKRONISASI STATE
      setIsEditing(false);
      toast.success('Profile synced perfectly!', { id: updateToast });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sync failed', { id: updateToast });
    } finally { setIsUpdating(false); }
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center bg-[#09141a] text-[#62cdcb] font-bold tracking-widest animate-pulse">LOADING...</main>;

  const displayUsername = user?.user?.username || user?.username || 'User';
  const displayEmail = user?.user?.email || user?.email || 'No Email';

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1f3d47] via-[#0d1d23] to-[#09141a] text-white p-6 font-sans">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="flex justify-between items-center mb-10 max-w-md mx-auto w-full">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium hover:text-[#62cdcb] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg> Back
        </button>
        <span className="font-bold text-lg text-gray-300 tracking-wide">@{displayUsername}</span>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Profile Card */}
        <div className="bg-[#162329] p-6 rounded-3xl border border-[#ffffff1a] shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#62cdcb] to-[#4599db] opacity-10 rounded-bl-full"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#62cdcb] to-[#1f3d47] flex items-center justify-center text-3xl font-bold border border-[#ffffff1a] uppercase shadow-lg text-white">
                {displayUsername.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{displayUsername}</h1>
                <p className="text-gray-400 text-sm mt-1">{displayEmail}</p>
              </div>
            </div>
            
            <button onClick={() => setIsEditing(!isEditing)} className="text-[#62cdcb] text-xs font-bold bg-[#62cdcb]/10 px-5 py-2 rounded-full hover:bg-[#62cdcb]/20 transition-all border border-[#62cdcb]/30">
              {isEditing ? 'CANCEL' : 'EDIT'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="mt-4 border-t border-[#ffffff0a] pt-6 flex flex-col gap-6 relative z-10">
              {/* Input Username & Email dibungkus */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 mb-2 block font-bold uppercase tracking-[2px]">Username</label>
                  <input type="text" value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} className="w-full bg-[#0d1d23] border border-[#ffffff0a] rounded-2xl p-4 outline-none focus:border-[#62cdcb]/50 transition-colors text-sm text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 mb-2 block font-bold uppercase tracking-[2px]">Email</label>
                  <input type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full bg-[#0d1d23] border border-[#ffffff0a] rounded-2xl p-4 outline-none focus:border-[#62cdcb]/50 transition-colors text-sm text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 mb-2 block font-bold uppercase tracking-[2px]">Birthday</label>
                <input type="date" value={editData.birthday} onChange={(e) => {
                    const date = e.target.value;
                    const {zodiac, horoscope} = getZodiacAndHoroscope(date);
                    setEditData({...editData, birthday: date, zodiac, horoscope});
                  }} className="w-full bg-[#0d1d23] border border-[#ffffff0a] rounded-2xl p-4 outline-none focus:border-[#62cdcb]/50 transition-colors text-sm text-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 mb-2 block font-bold uppercase tracking-[2px]">Zodiac</label>
                  <input readOnly value={editData.zodiac} className="w-full bg-[#0d1d23] border border-[#ffffff0a] rounded-2xl p-4 text-gray-500 text-xs cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 mb-2 block font-bold uppercase tracking-[2px]">Horoscope</label>
                  <input readOnly value={editData.horoscope} className="w-full bg-[#0d1d23] border border-[#ffffff0a] rounded-2xl p-4 text-gray-500 text-xs cursor-not-allowed" />
                </div>
              </div>

              {/* Input Interests sebagai Tag */}
              <div>
                <label className="text-[10px] text-gray-500 mb-2 block font-bold uppercase tracking-[2px]">Interests</label>
                <div className="flex flex-wrap gap-2 mb-3 bg-[#0d1d23] p-3 rounded-2xl border border-[#ffffff0a] min-h-[50px]">
                  {editData.interests.map(interest => (
                    <span key={interest} className="bg-[#ffffff1a] px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-[#ffffff0a]">
                      {interest} <button type="button" onClick={() => removeInterest(interest)} className="text-red-400 font-bold text-lg leading-none hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
                <input type="text" value={tempInterest} onChange={(e) => setTempInterest(e.target.value)} onKeyDown={addInterest} placeholder="Type an interest and press Enter..." className="w-full bg-[#0d1d23] border border-[#ffffff0a] rounded-2xl p-4 outline-none focus:border-[#62cdcb]/50 transition-colors text-sm text-white" />
              </div>

              <button type="submit" disabled={isUpdating} className="w-full bg-gradient-to-r from-[#62cdcb] to-[#4599db] text-white font-bold py-4 rounded-2xl mt-2 disabled:opacity-50 shadow-xl shadow-[#62cdcb]/10 active:scale-95 transition-all uppercase tracking-widest">
                {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0d1d23] p-4 rounded-2xl border border-[#ffffff0a] flex justify-between items-center"><span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Birthday</span><span className="text-sm font-medium text-white">{user?.birthday ? new Date(user.birthday).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span></div>
              <div className="bg-[#0d1d23] p-4 rounded-2xl border border-[#ffffff0a] flex justify-between items-center"><span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Zodiac</span><span className="text-sm font-medium text-white">{user?.zodiac || '-'}</span></div>
              <div className="bg-[#0d1d23] p-4 rounded-2xl border border-[#ffffff0a] flex justify-between items-center"><span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Horoscope</span><span className="text-sm font-medium text-white">{user?.horoscope || '-'}</span></div>
              
              {/* Display Interests */}
              <div className="bg-[#0d1d23] p-4 rounded-2xl border border-[#ffffff0a]"><label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3 block">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {user?.interests && user.interests.length > 0 ? user.interests.map((interest: string) => (
                    <span key={interest} className="bg-[#ffffff1a] px-3 py-1.5 rounded-full text-xs border border-[#ffffff0a] text-white font-medium">{interest}</span>
                  )) : <span className="text-sm text-gray-600 font-medium">-</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} className="w-full bg-transparent border border-red-500/20 text-red-500/60 font-bold py-4 rounded-3xl mt-2 hover:bg-red-500/5 hover:text-red-500 transition-all text-xs tracking-[3px]">LOGOUT</button>
      </div>
    </main>
  );
}