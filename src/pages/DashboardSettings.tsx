import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Camera, Save, Loader2, CheckCircle2 } from 'lucide-react';

export function DashboardSettings() {
  const { currentUser, token, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setSuccess(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/users/profile`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        updateUser(json.data);
        setSuccess(true);
      } else {
        alert(json.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
         <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
            <p className="text-gray-400 font-medium mt-1">Customize your author presence and identity.</p>
         </div>
         {success && (
            <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-50 px-4 py-2 rounded-2xl animate-in fade-in zoom-in">
               <CheckCircle2 size={20} />
               <span className="text-xs uppercase tracking-widest">Profile Synced</span>
            </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Avatar Column */}
         <div className="space-y-6">
            <ClayCard className="flex flex-col items-center p-10 bg-white/50 backdrop-blur-sm border-2 border-white shadow-clay-hover text-center">
               <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-clay-badge border-4 border-white transition-transform group-hover:scale-105 duration-500 bg-gray-50 flex items-center justify-center">
                     {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                        <div className="text-gray-300 font-black text-4xl uppercase">{name.charAt(0) || '?'}</div>
                     )}
                  </div>
                  <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-xl shadow-clay-badge hover:scale-110 transition-all border-2 border-white"
                  >
                     <Camera size={18} />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
               </div>
               <h3 className="mt-6 font-black text-gray-900 text-lg">{currentUser?.name}</h3>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1 italic">{currentUser?.role}</p>
            </ClayCard>

            <div className="p-6 bg-primary/5 rounded-3xl border-2 border-primary/10 space-y-3">
               <h4 className="font-black text-primary text-[10px] uppercase tracking-widest">Pro Tip</h4>
               <p className="text-xs text-primary/70 font-medium leading-relaxed italic">
                  "A professional bio and high-quality avatar increase your reader engagement by up to 40%."
               </p>
            </div>
         </div>

         {/* Form Column */}
         <form onSubmit={handleSave} className="md:col-span-2 space-y-6">
            <ClayCard className="space-y-8 bg-white/50 backdrop-blur-sm border-2 border-white shadow-clay-hover p-10">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Display Name</label>
                     <Input 
                        value={name}
                        onChange={(e) => {setName(e.target.value); setSuccess(false);}}
                        className="py-6 px-6 !bg-white/80 !shadow-clay text-lg font-bold border-0 focus:shadow-clay-hover"
                        placeholder="Your published name..."
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Professional Bio</label>
                     <Textarea 
                        value={bio}
                        onChange={(e) => {setBio(e.target.value); setSuccess(false);}}
                        className="min-h-[160px] py-6 px-6 !bg-white/80 !shadow-clay text-base font-medium leading-relaxed border-0 focus:shadow-clay-hover"
                        placeholder="Tell the world about your passions, experience, and what drives your writing..."
                     />
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</p>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-xs font-bold text-gray-600">Active</span>
                     </div>
                  </div>
                  <Button 
                     type="submit" 
                     className="shadow-clay-badge !px-10 rounded-2xl h-14 font-black uppercase text-xs tracking-widest"
                     disabled={loading}
                  >
                     {loading ? (
                        <>
                           <Loader2 className="animate-spin mr-2" size={18} />
                           Saving...
                        </>
                     ) : (
                        <>
                           <Save className="mr-2" size={18} />
                           Update Profile
                        </>
                     )}
                  </Button>
               </div>
            </ClayCard>
         </form>
      </div>
    </div>
  );
}
