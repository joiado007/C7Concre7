
// Dados
const PAVER_MODELS = [
  {
    id: '16-faces',
    name: 'Paver 16 Faces',
    dimensions: '24 × 10 × 6 cm',
    consumption: 42,
    image: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'tijolinho',
    name: 'Paver Tijolinho',
    dimensions: '20 × 10 × 6 cm',
    consumption: 50,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200'
  }
];

// Estado
let state = {
  currentTab: 'calculator',
  area: '',
  selectedModelId: PAVER_MODELS[0].id,
  loss: 5,
  price: '1.10',
  history: JSON.parse(localStorage.getItem('concre7_history') || '[]'),
  lastResult: null
};

// Elementos
const appContent = document.getElementById('app-content');
const btnCalc = document.getElementById('nav-calc');
const btnHistory = document.getElementById('nav-history');

// Inicialização
function init() {
  render();
}

function render() {
  if (state.currentTab === 'calculator') {
    renderCalculator();
  } else {
    renderHistory();
  }
  updateNavUI();
}

function updateNavUI() {
  if (state.currentTab === 'calculator') {
    btnCalc.classList.add('active-tab');
    btnCalc.classList.remove('text-gray-400');
    btnHistory.classList.remove('active-tab');
    btnHistory.classList.add('text-gray-400');
  } else {
    btnHistory.classList.add('active-tab');
    btnHistory.classList.remove('text-gray-400');
    btnCalc.classList.remove('active-tab');
    btnCalc.classList.add('text-gray-400');
  }
}

function renderCalculator() {
  appContent.innerHTML = `
    <div class="space-y-6 animate-in fade-in duration-300">
      <section class="bg-white p-5 rounded-2xl card-shadow border border-gray-100">
        <label class="block text-sm font-bold text-gray-700 mb-2">Área Total (m²)</label>
        <input type="number" id="area-in" inputmode="decimal" placeholder="0.00" value="${state.area}" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-orange-500">
      </section>

      <section>
        <h3 class="text-sm font-bold text-gray-700 mb-3 ml-1">Modelo</h3>
        <div class="space-y-3">
          ${PAVER_MODELS.map(m => `
            <div onclick="selectModel('${m.id}')" class="flex items-center gap-4 p-3 rounded-2xl border-2 cursor-pointer transition-all ${state.selectedModelId === m.id ? 'border-orange-600 bg-orange-50' : 'border-gray-100 bg-white'}">
              <img src="${m.image}" class="w-14 h-14 object-cover rounded-xl">
              <div class="flex-1">
                <p class="font-bold text-sm ${state.selectedModelId === m.id ? 'text-orange-700' : 'text-gray-800'}">${m.name}</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase">${m.consumption} pçs/m²</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="bg-white p-5 rounded-2xl card-shadow border border-gray-100">
        <label class="block text-sm font-bold text-gray-700 mb-3">Perda (%)</label>
        <div class="flex gap-2 mb-5">
          ${[0, 5, 10].map(v => `
            <button onclick="setLoss(${v})" class="flex-1 py-2 rounded-xl font-bold border-2 transition-all ${state.loss === v ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-gray-100 text-gray-400'}">${v}%</button>
          `).join('')}
        </div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Preço Unitário (R$)</label>
        <input type="number" id="price-in" inputmode="decimal" step="0.01" value="${state.price}" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
      </section>

      <button onclick="calculate()" class="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">GERAR ORÇAMENTO</button>

      <div id="result-box">${state.lastResult ? renderResult(state.lastResult) : ''}</div>
    </div>
  `;

  document.getElementById('area-in').addEventListener('input', e => state.area = e.target.value);
  document.getElementById('price-in').addEventListener('input', e => state.price = e.target.value);
}

function renderResult(r) {
  return `
    <div class="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-orange-600 mt-4 animate-in slide-in-from-bottom-2">
      <p class="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-1">Resultado</p>
      <p class="text-xl font-black text-gray-800 mb-4">${r.modelName}</p>
      <div class="flex justify-between items-center border-b border-gray-50 py-2">
        <span class="text-sm text-gray-400">Total de Peças</span>
        <span class="font-bold text-gray-800">${r.totalPieces.toLocaleString()} pçs</span>
      </div>
      <div class="flex justify-between items-center pt-4">
        <span class="text-sm text-gray-400 font-bold uppercase">Valor Total</span>
        <span class="text-2xl font-black text-orange-600">R$ ${r.totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
      </div>
    </div>
  `;
}

function renderHistory() {
  if (state.history.length === 0) {
    appContent.innerHTML = `<div class="py-20 text-center text-gray-400 text-sm">Nenhum histórico salvo.</div>`;
    return;
  }
  appContent.innerHTML = `
    <div class="space-y-4 animate-in fade-in">
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-black text-gray-800">Histórico</h2>
        <button onclick="clearAll()" class="text-[10px] font-bold text-red-500">LIMPAR TUDO</button>
      </div>
      ${state.history.map(h => `
        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-end">
          <div>
            <p class="text-[9px] text-gray-300 font-bold mb-1">${h.date}</p>
            <p class="font-bold text-gray-800 text-sm">${h.modelName}</p>
            <p class="text-[10px] text-gray-400 uppercase">${h.area}m² • ${h.lossPercent}% perda</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-black text-orange-600">R$ ${h.totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Eventos Globais (Window)
window.switchTab = (t) => { state.currentTab = t; render(); };
window.selectModel = (id) => { state.selectedModelId = id; render(); };
window.setLoss = (v) => { state.loss = v; render(); };
window.clearAll = () => { if(confirm('Limpar histórico?')) { state.history = []; localStorage.removeItem('concre7_history'); render(); }};

window.calculate = () => {
  const area = parseFloat(state.area);
  if(!area || area <= 0) return alert('Informe a área');
  const model = PAVER_MODELS.find(m => m.id === state.selectedModelId);
  const totalPieces = Math.ceil((area * model.consumption) * (1 + state.loss/100));
  const totalValue = totalPieces * parseFloat(state.price || 0);
  
  const res = {
    id: Date.now(),
    date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}),
    modelName: model.name,
    area,
    lossPercent: state.loss,
    totalPieces,
    totalValue
  };

  state.lastResult = res;
  state.history = [res, ...state.history];
  localStorage.setItem('concre7_history', JSON.stringify(state.history));
  render();
};

init();
