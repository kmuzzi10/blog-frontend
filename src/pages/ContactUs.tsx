import { useState } from 'react';
import { ClayCard } from '../components/ui/ClayCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Textarea, Input } from '../components/ui/Input';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, Globe } from 'lucide-react';

export function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    { icon: <Mail className="text-primary" size={24} />, label: 'Email Support', value: 'hello@clayblog.com' },
    { icon: <Phone className="text-primary" size={24} />, label: 'Call Center', value: '+1 (555) 000-0000' },
    { icon: <MapPin className="text-primary" size={24} />, label: 'Global HQ', value: '123 Creative Blvd, New York' },
    { icon: <Globe className="text-primary" size={24} />, label: 'Legal & Press', value: 'press@clayblog.com' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <section className="text-center space-y-6 pt-12">
        <Badge variant="accent" className="px-6 py-2">Get in Touch</Badge>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 !leading-tight">
          How Can We <span className="text-primary">Help You?</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
          "Your questions and feedback help us sculpt a better platform for everyone."
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <ClayCard className="p-10 md:p-12 relative overflow-hidden group border-2 border-white/50 bg-white hover:shadow-clay-hover transition-all duration-700">
          <div className="relative z-10">
            {isSent ? (
              <div className="py-20 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-3xl shadow-clay flex items-center justify-center mx-auto scale-110 mb-8">
                  <CheckCircle className="text-emerald-500" size={48} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Message Received!</h3>
                <p className="text-gray-500 text-lg font-medium max-w-xs mx-auto mb-10">Our creators team will review your enquiry and get back to you shortly.</p>
                <Button variant="ghost" onClick={() => setIsSent(false)} className="rounded-full px-10 py-4 font-black tracking-widest uppercase">Send another message</Button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-4 text-center lg:text-left">Send Enquiry</h2>
                <p className="text-gray-500 font-medium mb-10 text-center lg:text-left leading-relaxed">Fill out the form below and we’ll respond within 24 hours.</p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                            <Input placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-[1.5rem] px-6 py-4 shadow-clay-inset border-0 focus:shadow-clay-inset-hover" required />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                            <Input type="email" placeholder="john@doe.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rounded-[1.5rem] px-6 py-4 shadow-clay-inset border-0 focus:shadow-clay-inset-hover" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Subject Enquiry</label>
                        <Input placeholder="I have a question about..." value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="rounded-[1.5rem] px-6 py-4 shadow-clay-inset border-0 focus:shadow-clay-inset-hover" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Message Body</label>
                        <Textarea placeholder="How can we help?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="min-h-[160px] rounded-[2rem] px-6 py-4 shadow-clay-inset border-0 focus:shadow-clay-inset-hover" required />
                    </div>
                    <div className="pt-4 flex justify-center lg:justify-end">
                        <Button type="submit" variant="primary" disabled={isSubmitting} size="lg" className="rounded-full px-12 py-6 font-black tracking-widest uppercase shadow-clay text-lg flex gap-3">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="animate-spin" size={24} />
                                Sending...
                              </>
                            ) : (
                                <>
                                  <Send size={20} />
                                  Send Message
                                </>
                            )}
                        </Button>
                    </div>
                </form>
              </>
            )}
          </div>
        </ClayCard>

        {/* Info Cards */}
        <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight text-center lg:text-left">Our Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, idx) => (
                <ClayCard key={idx} className="p-8 border-2 border-white/50 group hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl shadow-clay flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {info.icon}
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{info.label}</h4>
                  <p className="text-lg font-black text-gray-800">{info.value}</p>
                </ClayCard>
              ))}
            </div>

            <ClayCard className="p-10 border-2 border-white/50 bg-gray-50/50 backdrop-blur-sm relative overflow-hidden group">
                 <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-1000" />
                 <h4 className="text-xl font-black text-gray-800 mb-2">Live Support?</h4>
                 <p className="text-gray-500 font-medium leading-relaxed mb-6">Our chat support is available Monday to Friday from 9AM to 6PM EST.</p>
                 <Button variant="ghost" className="rounded-full px-8 py-3 font-black tracking-widest uppercase border-primary/20 text-primary">Chat with us</Button>
            </ClayCard>
        </div>
      </div>
    </div>
  );
}
