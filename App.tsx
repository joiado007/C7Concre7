
import React, { useState, useEffect, useCallback } from 'react';
import { Tab, CalculationResult, PaverModel } from './types';
import { PAVER_MODELS, LOSS_OPTIONS, DEFAULT_PRICE, LOCAL_STORAGE_KEY } from './constants';
import Header from './components/Header';
import Calculator from './components/Calculator';
import History from './components/History';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CALCULATOR);
  const [history, setHistory] = useState<CalculationResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = useCallback((result: CalculationResult) => {
    setHistory(prev => {
      const newHistory = [result, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm("Deseja realmente limpar todo o histórico?")) {
      setHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />
      
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4">
        {activeTab === Tab.CALCULATOR ? (
          <Calculator onSave={addToHistory} onNavigateToHistory={() => setActiveTab(Tab.HISTORY)} />
        ) : (
          <History 
            history={history} 
            onDelete={deleteFromHistory} 
            onClear={clearHistory}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
