import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FloatingOrb } from '../components/ui/FloatingOrb';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 overflow-x-hidden">
      {/* Global Background 3D effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingOrb color="bg-primary/5" size={600} top="-10%" left="-5%" delay={0} duration={25} />
        <FloatingOrb color="bg-secondary/5" size={500} top="70%" left="75%" delay={5} duration={30} />
      </div>

      <Navbar />
      <main className="relative z-10 pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
