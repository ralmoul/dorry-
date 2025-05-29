
import React from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  isNavScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navigation = ({ isNavScrolled, isMobileMenuOpen, setIsMobileMenuOpen }: NavigationProps) => {
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 py-3 md:py-4 transition-all duration-500 backdrop-blur-md ${isNavScrolled ? 'bg-slate-900/90 shadow-lg' : ''}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-cyan-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex space-x-8">
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="/login" className="px-6 py-2 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors">
            Se connecter
          </a>
          <a href="/signup" className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 rounded-lg hover:shadow-lg transition-all">
            S'inscrire
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <a href="/login" className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors text-center">
                Se connecter
              </a>
              <a href="/signup" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 rounded-lg hover:shadow-lg transition-all text-center font-semibold">
                S'inscrire
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
