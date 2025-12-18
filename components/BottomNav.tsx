
import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center safe-bottom z-50">
      <button
        onClick={() => onTabChange(Tab.CALCULATOR)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === Tab.CALCULATOR ? 'text-orange-600' : 'text-gray-400'
        }`}
      >
        <svg className="w-6 h-6" fill={activeTab === Tab.CALCULATOR ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">Cálculo</span>
      </button>

      <button
        onClick={() => onTabChange(Tab.HISTORY)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === Tab.HISTORY ? 'text-orange-600' : 'text-gray-400'
        }`}
      >
        <svg className="w-6 h-6" fill={activeTab === Tab.HISTORY ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">Histórico</span>
      </button>
    </nav>
  );
};

export default BottomNav;
