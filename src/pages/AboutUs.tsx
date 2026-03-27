import { ClayCard } from '../components/ui/ClayCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PenTool, Heart, Shield, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutUs() {
  const values = [
    { icon: <Heart className="text-pink-500" />, title: 'Passion', desc: 'We believe in the power of stories and the people who tell them.' },
    { icon: <Shield className="text-blue-500" />, title: 'Integrity', desc: 'Trust is our foundation. We maintain high standards for content and privacy.' },
    { icon: <Award className="text-amber-500" />, title: 'Excellence', desc: 'We strive for quality in every pixel and every line of code.' },
    { icon: <Users className="text-emerald-500" />, title: 'Community', desc: 'ClayBlog is more than a platform; it’s a space where voices belong.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-20 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12">
        <Badge variant="accent" className="px-6 py-2">Our Story</Badge>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 !leading-tight text-balance">
          Crafting a New Era of <span className="text-primary italic">Digital Expression</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
          "Where every word is sculpted with care, and every story finds its home."
        </p>
      </section>

      {/* Main Content */}
      <ClayCard className="p-12 md:p-20 relative overflow-hidden group border-2 border-white/50 bg-white">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-1000" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-3xl shadow-clay">
              <PenTool className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">Who We Are</h2>
          </div>
          
          <div className="space-y-6 text-lg text-gray-600 font-medium leading-[2.2rem]">
            <p>
              Founded in 2026, ClayBlog was born out of a simple idea: that digital publishing should be as tactile, meaningful, and carefully crafted as manual sculpture. We noticed that in a world of fast-paced information, the *art* of storytelling was being lost to rigid templates and generic designs.
            </p>
            <p>
              Our mission is to provide creators with a "clay-like" platform—one that is flexible, beautiful, and fundamentally built for human expression. Whether you are a professional author, a passionate hobbyist, or an explorer for new ideas, ClayBlog offers you the space to shape your narrative without limitations.
            </p>
          </div>
        </div>
      </ClayCard>

      {/* Values Grid */}
      <section className="space-y-12">
        <div className="text-center">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">The Values that Shape Us</h2>
            <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Foundation of ClayBlog</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v, i) => (
            <ClayCard key={i} className="p-10 border-2 border-white/50 group hover:shadow-clay-hover hover:-translate-y-2 transition-all duration-500 bg-white">
              <div className="bg-white shadow-clay-badge p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h4 className="text-xl font-black text-gray-800 mb-3">{v.title}</h4>
              <p className="text-gray-500 font-medium leading-relaxed">{v.desc}</p>
            </ClayCard>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <ClayCard className="p-12 text-center bg-gray-50/50 backdrop-blur-sm overflow-hidden relative border-2 border-white/80">
        <div className="relative z-10 space-y-6">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Ready to start sculpting your story?</h3>
          <p className="text-gray-500 max-w-lg mx-auto font-medium leading-relaxed">Join thousands of creators who are already using ClayBlog to reach their audience and build their platform.</p>
          <div className="pt-4">
             <Link to="/register">
                <Button variant="primary" size="lg" className="rounded-full px-12 py-6 font-black tracking-widest uppercase shadow-clay text-lg">Join the community</Button>
             </Link>
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
