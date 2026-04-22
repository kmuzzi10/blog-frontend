import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 rounded-full shadow-clay bg-white border border-gray-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-300"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-gray-700" />
      ) : (
        <Sun size={18} className="text-yellow-400" />
      )}
    </Button>
  );
}
