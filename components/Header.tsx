
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 pt-4 pb-4 px-4 sticky top-0 z-50">
      <div className="max-w-lg mx-auto flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-orange-600 text-white font-bold text-xl px-2 py-1 rounded shadow-sm">
            C7
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Concre<span className="text-orange-600">7</span>
          </h1>
        </div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
          Calculadora Profissional de Pavers
        </p>
      </div>
    </header>
  );
};

export default Header;
