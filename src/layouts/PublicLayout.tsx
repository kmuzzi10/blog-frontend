import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Navbar />
      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
