
import React, { useState } from 'react';
import { PAVER_MODELS, LOSS_OPTIONS, DEFAULT_PRICE } from '../constants';
import { CalculationResult, PaverModel } from '../types';

interface CalculatorProps {
  onSave: (result: CalculationResult) => void;
  onNavigateToHistory: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSave, onNavigateToHistory }) => {
  const [area, setArea] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<PaverModel>(PAVER_MODELS[0]);
  const [loss, setLoss] = useState<number>(5);
  const [price, setPrice] = useState<string>(DEFAULT_PRICE.toFixed(2));
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const areaNum = parseFloat(area);
    const priceNum = parseFloat(price);

    if (isNaN(areaNum) || areaNum <= 0) {
      alert("Por favor, insira uma área válida.");
      return;
    }

    const basePieces = areaNum * selectedModel.consumption;
    const totalPieces = Math.ceil(basePieces * (1 + loss / 100));
    const totalValue = totalPieces * (isNaN(priceNum) ? 0 : priceNum);

    const newResult: CalculationResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('pt-BR'),
      modelName: selectedModel.name,
      area: areaNum,
      lossPercent: loss,
      pricePerPiece: isNaN(priceNum) ? 0 : priceNum,
      totalPieces,
      totalValue
    };

    setResult(newResult);
    onSave(newResult);
    
    // Smooth scroll to results
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Input de Área */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Área Total (m²)
        </label>
        <input
          type="number"
          inputMode="decimal"
          placeholder="Ex: 50.00"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </section>

      {/* Seleção de Modelo */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 ml-1">Modelo de Paver</h3>
        <div className="grid grid-cols-1 gap-3">
          {PAVER_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all text-left ${
                selectedModel.id === model.id
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <img
                src={model.image}
                alt={model.name}
                className="w-20 h-20 object-cover rounded-xl shadow-sm"
              />
              <div className="flex-1">
                <p className={`font-bold ${selectedModel.id === model.id ? 'text-orange-700' : 'text-gray-800'}`}>
                  {model.name}
                </p>
                <p className="text-xs text-gray-500 mb-1">{model.dimensions}</p>
                <p className="text-xs font-medium text-gray-600">
                  Consumo: <span className="text-orange-600">{model.consumption}</span> pçs/m²
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedModel.id === model.id ? 'bg-orange-600 border-orange-600' : 'border-gray-300'
              }`}>
                {selectedModel.id === model.id && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Parâmetros Extras */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Percentual de Perda
          </label>
          <div className="flex gap-2">
            {LOSS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setLoss(opt)}
                className={`flex-1 py-2 rounded-xl font-bold transition-all border-2 ${
                  loss === opt
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                {opt}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preço por Peça (R$)
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-orange-500 outline-none"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </section>

      {/* Botão Calcular */}
      <button
        onClick={handleCalculate}
        className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Gerar Orçamento
      </button>

      {/* Resultado */}
      {result && (
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-orange-600 font-bold uppercase text-xs tracking-wider mb-1">Resultado do Cálculo</h4>
              <p className="text-xl font-extrabold text-gray-800">{result.modelName}</p>
            </div>
            <div className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
              {result.area}m²
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm">Peças necessárias (+{result.lossPercent}% perda)</span>
              <span className="font-bold text-gray-800 text-lg">{result.totalPieces.toLocaleString()} pçs</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm font-semibold">VALOR TOTAL ESTIMADO</span>
              <span className="font-black text-orange-600 text-2xl">
                R$ {result.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <p className="text-[10px] text-gray-400 font-medium">Salvo automaticamente no histórico.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Calculator;
