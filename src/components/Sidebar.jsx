import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calculator, FileText, Image, Printer, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col no-print">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bebas tracking-widest text-[#00FF55]">IMAGINE</h1>
        <p className="text-xs text-gray-400 tracking-widest">CREATIVE HUB</p>
      </div>

      <nav className="flex-1 space-y-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#00FF55] text-gray-900 font-bold' : 'hover:bg-gray-800 text-gray-300'
            }`
          }
        >
          <FileText size={20} />
          <span>Orçamento</span>
        </NavLink>

        <NavLink 
          to="/social" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#00FF55] text-gray-900 font-bold' : 'hover:bg-gray-800 text-gray-300'
            }`
          }
        >
          <Image size={20} />
          <span>Redes Sociais</span>
        </NavLink>

        <NavLink 
          to="/card" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#00FF55] text-gray-900 font-bold' : 'hover:bg-gray-800 text-gray-300'
            }`
          }
        >
          <Printer size={20} />
          <span>Cartão Impresso</span>
        </NavLink>

        <NavLink 
          to="/pricing" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#00FF55] text-gray-900 font-bold' : 'hover:bg-gray-800 text-gray-300'
            }`
          }
        >
          <Calculator size={20} />
          <span>Precificador</span>
        </NavLink>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800 text-gray-500 text-xs flex items-center justify-center gap-2">
        <Settings size={14} /> Hub v2.0
      </div>
    </div>
  );
};

export default Sidebar;
