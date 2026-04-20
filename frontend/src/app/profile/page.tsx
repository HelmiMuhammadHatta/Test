'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

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
  const [editData, setEditData] = useState({ 
    username: '', email: '', birthday: '', zodiac: '', horoscope: '' 
  });

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await api.get('/api/getProfile', { headers: { Authorization: `Bearer ${token}` } });
      console.log("Data terbaru dari DB:", res.data);
      setUser(res.data);
      setEditData({
        username: res.data?.user?.username || res.data?.username || '',
        email: res.data?.user?.email || res.data?.email || '',
        birthday: res.data?.birthday ? res.data.birthday.split('T')[0] : '',
        zodiac: res.data?.zodiac || '',
        horoscope: res.data?.horoscope || ''
      });
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/createProfile', editData, { headers: { Authorization: `Bearer ${token}` } });
      await fetchProfile(); // Ambil data ulang agar sinkron
      setIsEditing(false);
      alert('Sinkronisasi Berhasil!');
    } catch (err: any) { alert('Gagal simpan: ' + err.response?.data?.message); } 
    finally { setIsUpdating(false); }
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center bg-[#09141a] text-[#62cdcb] font-bold">LOADING...</main>;

  const displayUsername = user?.user?.username || user?.username || 'User';
  const displayEmail = user?.user?.email || user?.email || 'No Email';

  return (
    <main className="min-h-screen bg-[#09141a] text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => router.back()} className="text-sm opacity-50">Back</button>
          <span className="font-bold">@{displayUsername}</span>
        </div>

        <div className="bg-[#162329] p-6 rounded-3xl border border-[#ffffff1a] shadow-2xl relative">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#62cdcb] to-[#4599db] flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
                {displayUsername.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{displayUsername}</h1>
                <p className="text-gray-400 text-sm">{displayEmail}</p>
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="text-[#62cdcb] text-xs font-bold border border-[#62cdcb]/30 px-5 py-2 rounded-full hover:bg-[#62cdcb]/10 transition-all">
              {isEditing ? 'CANCEL' : 'EDIT'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} placeholder="Username" className="w-full bg-[#0d1d23] p-4 rounded-xl outline-none text-sm" />
              <input type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} placeholder="Email" className="w-full bg-[#0d1d23] p-4 rounded-xl outline-none text-sm" />
              <input type="date" value={editData.birthday} onChange={(e) => {
                  const date = e.target.value;
                  const {zodiac, horoscope} = getZodiacAndHoroscope(date);
                  setEditData({...editData, birthday: date, zodiac, horoscope});
                }} className="w-full bg-[#0d1d23] p-4 rounded-xl outline-none text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input readOnly value={editData.zodiac} className="bg-[#0d1d23] p-4 rounded-xl text-gray-500 text-xs" />
                <input readOnly value={editData.horoscope} className="bg-[#0d1d23] p-4 rounded-xl text-gray-500 text-xs" />
              </div>
              <button type="submit" disabled={isUpdating} className="w-full bg-gradient-to-r from-[#62cdcb] to-[#4599db] py-4 rounded-xl font-bold shadow-lg shadow-[#62cdcb]/20 transition-all">
                {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-[#0d1d23] rounded-xl"><span className="opacity-50">Birthday</span><span>{user?.birthday ? new Date(user.birthday).toLocaleDateString('id-ID') : '-'}</span></div>
              <div className="flex justify-between p-4 bg-[#0d1d23] rounded-xl"><span className="opacity-50">Zodiac</span><span>{user?.zodiac || '-'}</span></div>
              <div className="flex justify-between p-4 bg-[#0d1d23] rounded-xl"><span className="opacity-50">Horoscope</span><span>{user?.horoscope || '-'}</span></div>
            </div>
          )}
        </div>
        <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} className="w-full mt-10 text-red-400 font-bold py-4">LOGOUT</button>
      </div>
    </main>
  );
}