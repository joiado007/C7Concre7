
// Configurações e Dados
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

// Estado da Aplicação
let state = {
  currentTab: 'calculator',
  area: '',
  selectedModelId: PAVER_MODELS[0].id,
  loss: 5,
  price: '1.10',
  history: JSON.parse(localStorage.getItem('concre7_history') || '[]'),
  lastResult: null
};

// Seletores DOM
const appContent = document.getElementById('app-content');
const navCalc = document.getElementById('nav-calc');
const navHistory = document.getElementById('nav-history');

// Funções de Renderização
function render() {
  if (state.currentTab === 'calculator') {
    renderCalculator();
  } else {
    renderHistory();
  }
  updateNav();
}

function updateNav() {
  if (state.currentTab === 'calculator') {
    navCalc.classList.add('active-tab');
    navHistory.classList.remove('active-tab');
    navHistory.classList.add('text-gray-400');
  } else {
    navHistory.classList.add('active-tab');
    navCalc.classList.remove('active-tab');
    navCalc.classList.add('text-gray-400');
  }
}

function renderCalculator() {
  const selectedModel = PAVER_MODELS.find(m => m.id === state.selectedModelId);
  
  appContent.innerHTML = `
    <div class="space-y-6 animate-in fade-in duration-300">
      <!-- Input de Área -->
      <section class="bg-white p-5 rounded-2xl card-shadow border border-gray-100">
        <label class="block text-sm font-bold text-gray-700 mb-2">Área Total (m²)</label>
        <input
          type="number"
          id="input-area"
          inputMode="decimal"
          placeholder="Ex: 50.00"
          value="${state.area}"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
        />
      </section>

      <!-- Modelos -->
      <section>
        <h3 class="text-sm font-bold text-gray-700 mb-3 ml-1">Modelo de Paver</h3>
        <div class="grid grid-cols-1 gap-3">
          ${PAVER_MODELS.map(model => `
            <button
              onclick="selectModel('${model.id}')"
              class="flex items-center gap-4 p-3 rounded-2xl border-2 transition-all text-left ${
                state.selectedModelId === model.id ? 'border-orange-600 bg-orange-50' : 'border-gray-100 bg-white'
              }"
            >
              <img src="${model.image}" alt="${model.name}" class="w-16 h-16 object-cover rounded-xl shadow-sm" />
              <div class="flex-1">
                <p class="font-bold ${state.selectedModelId === model.id ? 'text-orange-700' : 'text-gray-800'}">${model.name}</p>
                <p class="text-[10px] text-gray-400 uppercase font-bold">${model.dimensions}</p>
                <p class="text-xs font-medium text-gray-600">Consumo: <span class="text-orange-600 font-bold">${model.consumption}</span> pçs/m²</p>
              </div>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Parâmetros -->
      <section class="bg-white p-5 rounded-2xl card-shadow border border-gray-100">
        <div class="mb-5">
          <label class="block text-sm font-bold text-gray-700 mb-3">Perda (%)</label>
          <div class="flex gap-2">
            ${[0, 5, 10].map(opt => `
              <button
                onclick="setLoss(${opt})"
                class="flex-1 py-2.5 rounded-xl font-bold transition-all border-2 ${
                  state.loss === opt ? 'bg-orange-600 border-orange-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-400'
                }"
              >${opt}%</button>
            `).join('')}
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Preço por Peça (R$)</label>
          <input
            type="number"
            id="input-price"
            inputMode="decimal"
            step="0.01"
            value="${state.price}"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </section>

      <!-- Botão Ação -->
      <button
        onclick="calculate()"
        class="w-full bg-orange-600 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-orange-200 active:scale-[0.97] transition-all text-lg flex items-center justify-center gap-2"
      >
        GERAR ORÇAMENTO
      </button>

      <!-- Resultado -->
      <div id="result-container">
        ${state.lastResult ? renderResultCard(state.lastResult) : ''}
      </div>
    </div>
  `;

  // Listeners para inputs imediatos
  document.getElementById('input-area').addEventListener('input', (e) => state.area = e.target.value);
  document.getElementById('input-price').addEventListener('input', (e) => state.price = e.target.value);
}

function renderResultCard(res) {
  return `
    <section class="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-orange-600 mt-4 animate-in slide-in-from-bottom-2 duration-500">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h4 class="text-orange-600 font-black uppercase text-[10px] tracking-widest mb-1">Resultado</h4>
          <p class="text-xl font-extrabold text-gray-800">${res.modelName}</p>
        </div>
        <div class="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
          ${res.area}m²
        </div>
      </div>
      <div class="space-y-3 mb-6">
        <div class="flex justify-between items-center py-2 border-b border-gray-50">
          <span class="text-gray-400 text-sm font-medium">Quantidade (+${res.lossPercent}%)</span>
          <span class="font-bold text-gray-800 text-lg">${res.totalPieces.toLocaleString()} pçs</span>
        </div>
        <div class="flex justify-between items-center pt-2">
          <span class="text-gray-400 text-sm font-bold">TOTAL ESTIMADO</span>
          <span class="font-black text-orange-600 text-2xl">R$ ${res.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
      <div class="p-3 bg-gray-50 rounded-xl text-center">
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Salvo no histórico</p>
      </div>
    </section>
  `;
}

function renderHistory() {
  if (state.history.length === 0) {
    appContent.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-300">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-gray-800 font-bold text-lg mb-1">Histórico Vazio</h3>
        <p class="text-gray-400 text-sm max-w-[200px]">Os orçamentos que você gerar aparecerão aqui.</p>
      </div>
    `;
    return;
  }

  appContent.innerHTML = `
    <div class="space-y-4 animate-in fade-in duration-300">
      <div class="flex justify-between items-center px-1 mb-2">
        <h2 class="text-lg font-extrabold text-gray-800">Meus Orçamentos</h2>
        <button onclick="clearHistory()" class="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors">LIMPAR TUDO</button>
      </div>
      <div class="space-y-3">
        ${state.history.map(item => `
          <div class="bg-white p-4 rounded-2xl card-shadow border border-gray-100 relative overflow-hidden group">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[9px] text-gray-400 font-black uppercase tracking-widest">${item.date}</span>
              <button onclick="deleteHistoryItem('${item.id}')" class="text-gray-300 hover:text-red-500 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="flex justify-between items-end">
              <div>
                <p class="text-sm font-black text-gray-800 leading-tight">${item.modelName}</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase mt-0.5">${item.area}m² • ${item.lossPercent}% perda</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-gray-400 font-bold leading-none mb-1">${item.totalPieces.toLocaleString()} pçs</p>
                <p class="text-lg font-black text-orange-600 leading-none">R$ ${item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Funções de Ação
window.selectModel = (id) => {
  state.selectedModelId = id;
  render();
};

window.setLoss = (val) => {
  state.loss = val;
  render();
};

window.calculate = () => {
  const areaNum = parseFloat(state.area);
  const priceNum = parseFloat(state.price);
  const selectedModel = PAVER_MODELS.find(m => m.id === state.selectedModelId);

  if (!areaNum || areaNum <= 0) {
    alert("Por favor, informe a área em m²");
    return;
  }

  const basePieces = areaNum * selectedModel.consumption;
  const totalPieces = Math.ceil(basePieces * (1 + state.loss / 100));
  const totalValue = totalPieces * (priceNum || 0);

  const result = {
    id: Date.now().toString(),
    date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    modelName: selectedModel.name,
    area: areaNum,
    lossPercent: state.loss,
    totalPieces,
    totalValue
  };

  state.lastResult = result;
  state.history = [result, ...state.history];
  localStorage.setItem('concre7_history', JSON.stringify(state.history));
  
  render();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

window.deleteHistoryItem = (id) => {
  state.history = state.history.filter(i => i.id !== id);
  localStorage.setItem('concre7_history', JSON.stringify(state.history));
  render();
};

window.clearHistory = () => {
  if (confirm("Deseja apagar todo o histórico?")) {
    state.history = [];
    localStorage.removeItem('concre7_history');
    render();
  }
};

// Navegação
navCalc.addEventListener('click', () => {
  state.currentTab = 'calculator';
  render();
});

navHistory.addEventListener('click', () => {
  state.currentTab = 'history';
  render();
});

// Inicialização
render();
