
import React from 'react';
import { CalculationResult } from '../types';

interface HistoryProps {
  history: CalculationResult[];
  onDelete: (id: string) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onDelete, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-gray-800 font-bold text-lg mb-1">Histórico Vazio</h3>
        <p className="text-gray-500 text-sm max-w-[200px]">Os cálculos realizados aparecerão aqui para sua referência.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-gray-800">Orçamentos Salvos</h2>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1"
        >
          Limpar Tudo
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.date}</span>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
                title="Excluir"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold text-gray-800">{item.modelName}</p>
                <p className="text-xs text-gray-500">{item.area}m² • {item.lossPercent}% perda</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 leading-tight">{item.totalPieces.toLocaleString()} pçs</p>
                <p className="text-lg font-black text-orange-600 leading-none">
                  R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            {/* Indicador de acento laranja discreto */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
