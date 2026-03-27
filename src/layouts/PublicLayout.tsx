import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 max-w-7xl mx-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
