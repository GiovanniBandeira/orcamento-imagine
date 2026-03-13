/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Calculator, ShoppingBag, ArrowRight, Clock, AlertTriangle, Tag, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingCalculator = () => {
  const navigate = useNavigate();

  // TIPO DE MATERIAL
  const [materialType, setMaterialType] = useState('Resina'); // Resina ou Filamento

  // ENTRADAS DA PEÇA
  const [modelName, setModelName] = useState('');
  const [printTime, setPrintTime] = useState(1); // horas
  const [weight, setWeight] = useState(10); // gramas
  const [quantity, setQuantity] = useState(1); // Lote de Produção

  // CUSTOS EXTRAS
  const [extraCosts, setExtraCosts] = useState(0.00); // Embalagem, ímãs, parafusos, etc.

  // CUPONS
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });

  // CUSTOS FIXOS GERAIS
  const [internet, setInternet] = useState(60.00);
  const [software, setSoftware] = useState(54.23);
  const [expectedRevenue, setExpectedRevenue] = useState(400.00); // 400 para Resina, 300 para Filamento na planilha

  // CUSTOS VARIÁVEIS / MATERIAL
  const [materialKgPrice, setMaterialKgPrice] = useState(139.90);
  const [printerPower, setPrinterPower] = useState(42); // W
  const [kwhCost, setKwhCost] = useState(0.97);
  const [alcoholCost, setAlcoholCost] = useState(5.00); // 5 para resina, 28.9 para filamento na planilha

  // AMORTIZAÇÃO (MÁQUINA)
  const [printerValue, setPrinterValue] = useState(1180.10);
  const [printerLifeMonths, setPrinterLifeMonths] = useState(18); // meses

  // PINTURA
  const [hasPainting, setHasPainting] = useState(false);
  const [paintingLevel, setPaintingLevel] = useState('Simples'); // Simples, Média, Complexa
  const [painterHourCost, setPainterHourCost] = useState(20.00);
  const [primerCost, setPrimerCost] = useState(45.90);
  const [varnishCost, setVarnishCost] = useState(24.34);
  const [sprayYield, setSprayYield] = useState(20); // peças

  // MARKUP E TAXAS
  const [markupWithoutPaint, setMarkupWithoutPaint] = useState(4);
  const [markupWithPaint, setMarkupWithPaint] = useState(2);
  const [failureRate, setFailureRate] = useState(0.2); // 20%
  const [shopeeTax, setShopeeTax] = useState(0.20); // 20%
  const [mlTax, setMlTax] = useState(0.19); // 19%

  // TINTAS ACRILICAS FIXAS DA PLANILHA
  const ACRYLIC_PAINT_COST = { 'Simples': 2.00, 'Média': 4.00, 'Complexa': 6.00 };
  const PAINTER_TIME = { 'Simples': 1, 'Média': 1.5, 'Complexa': 2 };

  // --- INVENTÁRIO LOCAL (MÁQUINAS E MATERIAIS) ---
  const [savedPrinters, setSavedPrinters] = useState([]);
  const [savedMaterials, setSavedMaterials] = useState([]);
  
  // Modals de Cadastro
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // Form states p/ Nova Impressora
  const [newPrinterName, setNewPrinterName] = useState('');
  const [newPrinterPower, setNewPrinterPower] = useState(42);
  const [newPrinterValue, setNewPrinterValue] = useState(1180.10);
  const [newPrinterLife, setNewPrinterLife] = useState(18);

  // Form states p/ Novo Material
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialTypeDropdown, setNewMaterialTypeDropdown] = useState('Resina');
  const [newMaterialPrice, setNewMaterialPrice] = useState(139.90);

  // Carregar dados salvos ao montar a tela
  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('imagineHub_printers') || '[]');
    const m = JSON.parse(localStorage.getItem('imagineHub_materials') || '[]');
    setSavedPrinters(p);
    setSavedMaterials(m);
  }, []);

  // Helpers de Salvamento
  const handleSavePrinter = () => {
    if (!newPrinterName) return;
    const printer = {
      id: Date.now().toString(),
      name: newPrinterName,
      power: newPrinterPower,
      value: newPrinterValue,
      lifeMonths: newPrinterLife
    };
    const updated = [...savedPrinters, printer];
    setSavedPrinters(updated);
    localStorage.setItem('imagineHub_printers', JSON.stringify(updated));
    setShowPrinterModal(false);
    
    // Auto-Selecionar
    handleSelectPrinter(printer.id, updated);
  };

  const handleSaveMaterial = () => {
    if (!newMaterialName) return;
    const material = {
      id: Date.now().toString(),
      name: newMaterialName,
      type: newMaterialTypeDropdown,
      price: newMaterialPrice
    };
    const updated = [...savedMaterials, material];
    setSavedMaterials(updated);
    localStorage.setItem('imagineHub_materials', JSON.stringify(updated));
    setShowMaterialModal(false);
    
    // Auto-Selecionar
    handleSelectMaterial(material.id, updated);
  };

  // Helpers de Seleção Reversa
  const handleSelectPrinter = (id, list = savedPrinters) => {
    if(!id) return;
    const p = list.find(x => x.id === id);
    if(p) {
       setPrinterPower(p.power);
       setPrinterValue(p.value);
       setPrinterLifeMonths(p.lifeMonths);
    }
  };

  const handleSelectMaterial = (id, list = savedMaterials) => {
    if(!id) return;
    const m = list.find(x => x.id === id);
    if(m) {
       setMaterialType(m.type);
       setMaterialKgPrice(m.price);
    }
  };

  const handleDeletePrinter = (id) => {
    const updated = savedPrinters.filter(p => p.id !== id);
    setSavedPrinters(updated);
    localStorage.setItem('imagineHub_printers', JSON.stringify(updated));
  };
  
  const handleDeleteMaterial = (id) => {
    const updated = savedMaterials.filter(m => m.id !== id);
    setSavedMaterials(updated);
    localStorage.setItem('imagineHub_materials', JSON.stringify(updated));
  };

  // -------- CÁLCULOS PASSO A PASSO (IDÊNTICOS AO EXCEL) -------- //

  // -------- CÁLCULOS PASSO A PASSO (IDÊNTICOS À PLANILHA ORIGINAL) -------- //

  // 1. Custo Fixo Dissolvido
  const totalFixedCost = internet + software;
  const fixedCostDissolved = expectedRevenue > 0 ? totalFixedCost / expectedRevenue : 0;

  // 2. Amortização
  const totalAmortization = printerLifeMonths > 0 ? printerValue / printerLifeMonths : 0;

  // 3. Custos Diretos e Indiretos (POR PEÇA UNITÁRIA)
  const materialCost = (materialKgPrice / 1000) * weight;
  const powerCostInKw = (printerPower / 1000);
  const energyCost = powerCostInKw * printTime * kwhCost;

  const directCosts = materialCost + energyCost + alcoholCost;
  const indirectCosts = fixedCostDissolved + totalAmortization; // Custos da máquina

  // 3.5 Custos do Operador (Setup, Lavagem) - Removido a pedido
  // const operatorCostPerPiece = (setupTime / 60) * operatorHourCost;

  // 4. Falhas e Produto Cru (COM EXTRAS)
  // Igual à planilha: Soma direta
  const totalProductCostRaw = directCosts + indirectCosts + extraCosts;
  const failureCost = totalProductCostRaw * failureRate;

  const finalProductCost = totalProductCostRaw + failureCost;

  // 5. Custos de Pintura (POR PEÇA)
  let paintingCost = 0;
  if (hasPainting) {
    const acrylic = ACRYLIC_PAINT_COST[paintingLevel] || 0;
    const primerPerPiece = sprayYield > 0 ? primerCost / sprayYield : 0;
    const varnishPerPiece = sprayYield > 0 ? varnishCost / sprayYield : 0;
    const laborCost = (PAINTER_TIME[paintingLevel] || 0) * painterHourCost;

    paintingCost = acrylic + primerPerPiece + varnishPerPiece + laborCost;
  }

  // 6. Formação de Preços Unitários (COM MARGINAGEM TOTAL)
  const currentMarkup = hasPainting ? markupWithPaint : markupWithoutPaint;
  const totalCostBeforeMarkup = finalProductCost + paintingCost;

  const unitPriceClient = totalCostBeforeMarkup * currentMarkup;
  const unitProfit = unitPriceClient - totalCostBeforeMarkup;

  // 7. LOTE TOTAL (A APENAS MULTIPLICAÇÃO FINAL COMO NO EXCEL)
  let finalPriceClientTotal = unitPriceClient * quantity;
  let totalProfit = unitProfit * quantity;

  // Lógica de Leitura de Cupom (LocalStorage)
  const validateCoupon = () => {
    if (!couponInput) { setCouponMessage({ text: 'Digite o ID do Cupom', type: 'error' }); return; }

    const db = JSON.parse(localStorage.getItem('imagineHub_coupons') || '[]');
    const couponIndex = db.findIndex(c => c.id.toUpperCase() === couponInput.toUpperCase());

    if (couponIndex !== -1) {
      const coupon = db[couponIndex];
      if (coupon.used) {
        setCouponMessage({ text: 'Este cupom já foi utilizado no sistema!', type: 'error' });
      } else {
        // Validação de Vencimento
        const today = new Date();
        const [day, month, year] = coupon.expiresAt.split('/');
        const expiration = new Date(`${year}-${month}-${day}T23:59:59`);

        if (today > expiration) {
          setCouponMessage({ text: 'O cupom já expirou (Passou de 30 dias).', type: 'error' });
        } else {
          // Resgate válido! (Extraindo os numéricos de ex: "5%OFF")
          let discountVal = 5;
          if (coupon.code && coupon.code.includes('%')) {
            discountVal = parseInt(coupon.code.replace(/\D/g, '')) || 5;
          }
          setAppliedCoupon({ id: coupon.id, discountPercent: discountVal, material: coupon.material });
          setCouponMessage({ text: `Desconto de ${discountVal}% Ativado! (${coupon.material})`, type: 'success' });

          // Imediatamente marcar o resgate como concluído para que não seja re-utilizado
          db[couponIndex].used = true;
          localStorage.setItem('imagineHub_coupons', JSON.stringify(db));
        }
      }
    } else {
      setCouponMessage({ text: 'O Cupom não existe na nossa base local.', type: 'error' });
    }
  };

  // 6. Aplicar Descontos de fato no Preço do Lote
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = finalPriceClientTotal * (appliedCoupon.discountPercent / 100);
    finalPriceClientTotal -= discountAmount;
    totalProfit -= discountAmount; // O Desconto reduz o ganho base, não os custos operacionais
  }

  // Calculo Plataformas (Baseado no Lote Total Pós-Desconto)
  const priceShopee = finalPriceClientTotal / (1 - shopeeTax);
  const priceML = finalPriceClientTotal / (1 - mlTax);

  // Ação de Enviar para Orçamento
  const handleGenerateQuote = () => {
    navigate('/', {
      state: {
        modelName: modelName || 'Produto 3D',
        unitPrice: Math.ceil(unitPriceClient),
        totalPrice: Math.ceil(finalPriceClientTotal),
        quantity: quantity,
        paintingCost: hasPainting ? paintingCost : 0,
        hasPainting: hasPainting
      }
    });
  };

  return (
    <div className="p-4 md:p-8 font-sans text-gray-800 flex flex-col items-center bg-gray-50 min-h-screen">

      <div className="w-full max-w-6xl mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bebas text-gray-800 tracking-wide flex items-center gap-3">
            <Calculator size={36} className="text-[#00FF55]" />
            Precificador de Peças
          </h1>
          <p className="text-gray-500">Calcule os custos reais e o preço de venda de suas impressões 3D.</p>
        </div>

        <button
          onClick={handleGenerateQuote}
          className="bg-[#00FF55] hover:bg-[#00e64d] text-gray-900 font-bold py-3 px-6 rounded-lg shadow flex items-center gap-2 transition-transform hover:scale-105"
        >
          GERAR ORÇAMENTO REAIS <ArrowRight size={20} />
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">

        {/* COLUNA ESQUERDA: ENTRADAS */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">

          {/* Info Básica da Peça */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2"><ShoppingBag size={20} /> Dados da Impressão</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs uppercase font-bold text-gray-500">Nome da Peça</label>
                <input value={modelName} onChange={e => setModelName(e.target.value)} placeholder="Ex: Action Figure Luffy" className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00FF55] outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Material</label>
                <select value={materialType} onChange={e => setMaterialType(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00FF55] outline-none">
                  <option value="Resina">Resina</option>
                  <option value="Filamento">Filamento (FDM)</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Peso (gramas)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00FF55] outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Tempo (Horas)</label>
                <input type="number" step="0.1" value={printTime} onChange={e => setPrintTime(Number(e.target.value))} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00FF55] outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-[#00FF55]">Quantidade (Lote)</label>
                <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full p-2 border-2 border-[#00FF55] rounded focus:ring-2 focus:ring-green-400 outline-none font-bold bg-[#00FF55]/10" />
              </div>
            </div>
          </div>


          {/* Custos da Máquina e Material */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold">Custos Operacionais</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowPrinterModal(true)} className="text-xs bg-gray-200 hover:bg-gray-300 font-bold px-3 py-1 rounded text-gray-700 transition flex items-center gap-1">+ Impressora</button>
                <button onClick={() => setShowMaterialModal(true)} className="text-xs bg-gray-200 hover:bg-gray-300 font-bold px-3 py-1 rounded text-gray-700 transition flex items-center gap-1">+ Material</button>
              </div>
            </div>

            {/* Dropdowns de Salvos Rápidos */}
            {(savedPrinters.length > 0 || savedMaterials.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 border border-gray-100 p-4 rounded-lg">
                {savedPrinters.length > 0 && (
                  <div className="flex flex-col">
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1">Carregar Impressora</label>
                    <div className="flex gap-2">
                      <select onChange={(e) => handleSelectPrinter(e.target.value)} className="w-full p-2 border border-gray-300 rounded outline-none text-sm font-medium focus:ring-2 focus:ring-gray-400 bg-white">
                        <option value="">Selecione para preencher os dados...</option>
                        {savedPrinters.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {savedMaterials.length > 0 && (
                  <div className="flex flex-col">
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1">Carregar Material</label>
                    <div className="flex gap-2">
                      <select onChange={(e) => handleSelectMaterial(e.target.value)} className="w-full p-2 border border-gray-300 rounded outline-none text-sm font-medium focus:ring-2 focus:ring-gray-400 bg-white">
                        <option value="">Selecione para preencher os dados...</option>
                        {savedMaterials.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.type} - R$ {m.price})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Preço KG Material</label>
                <input type="number" step="0.1" value={materialKgPrice} onChange={e => setMaterialKgPrice(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Álcool/Limpeza</label>
                <input type="number" step="0.1" value={alcoholCost} onChange={e => setAlcoholCost(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Potência (Watts)</label>
                <input type="number" value={printerPower} onChange={e => setPrinterPower(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Preço kWh (R$)</label>
                <input type="number" step="0.01" value={kwhCost} onChange={e => setKwhCost(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Valor Impressora</label>
                <input type="number" step="10" value={printerValue} onChange={e => setPrinterValue(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Vida Útil (Meses)</label>
                <input type="number" value={printerLifeMonths} onChange={e => setPrinterLifeMonths(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Custo Fixo Mensal</label>
                <input type="number" value={totalFixedCost} readOnly className="w-full p-2 border rounded bg-gray-100 outline-none text-gray-500" title="Internet + Softwares" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Faturamento Prev.</label>
                <input type="number" value={expectedRevenue} onChange={e => setExpectedRevenue(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
              </div>
            </div>
          </div>

          {/* Custos de Pintura */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold">Acabamento e Pintura</h2>
              <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">Incluir Pintura?</span>
                <input type="checkbox" checked={hasPainting} onChange={e => setHasPainting(e.target.checked)} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
              </label>
            </div>

            {hasPainting ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 transition-all">
                <div className="col-span-2">
                  <label className="text-xs uppercase font-bold text-gray-500">Complexidade da Pintura</label>
                  <select value={paintingLevel} onChange={e => setPaintingLevel(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00FF55] outline-none">
                    <option value="Simples">Simples (Acrílica R$2 / 1h Mão de Obra)</option>
                    <option value="Média">Média (Acrílica R$4 / 1.5h Mão de Obra)</option>
                    <option value="Complexa">Complexa (Acrílica R$6 / 2h Mão de Obra)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-gray-500">Custo Hora Pintor</label>
                  <input type="number" value={painterHourCost} onChange={e => setPainterHourCost(Number(e.target.value))} className="w-full p-2 border rounded outline-none" />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-gray-500">Rendimento Sprays</label>
                  <input type="number" value={sprayYield} onChange={e => setSprayYield(Number(e.target.value))} className="w-full p-2 border rounded outline-none" title="Quantas peças um primer e verniz conseguem pintar" />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400 italic">Pintura desativada. O cálculo considerará apenas a impressão crua.</div>
            )}
          </div>

        </div>

        {/* COLUNA DIREITA: RESULTADOS */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">

          {/* UI de Resgate de Cupom (Novo) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-gray-700 flex items-center gap-2"><Tag size={16} /> Resgate de Cupom</h3>
            <div className="flex gap-2 relative">
              <input
                type="text"
                placeholder="Ex: #A7X92"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00FF55] outline-none font-mono uppercase bg-gray-50 text-gray-700 font-bold"
                disabled={appliedCoupon !== null}
              />
              <button
                onClick={validateCoupon}
                disabled={appliedCoupon !== null}
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded font-bold transition disabled:opacity-50"
              >
                Aplicar
              </button>
            </div>
            {couponMessage.text && (
              <div className={`mt-3 flex items-start gap-2 text-sm p-3 rounded bg-opacity-10 ${couponMessage.type === 'error' ? 'text-red-600 bg-red-600' : 'text-green-700 bg-green-500'}`}>
                {couponMessage.type === 'error' ? <XCircle size={18} className="mt-0.5" /> : <CheckCircle2 size={18} className="mt-0.5" />}
                <span>{couponMessage.text}</span>
              </div>
            )}
          </div>

          {/* Box Principal de Preço */}
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF55] opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>

            <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">Preço Final Lote ({quantity}x)</h3>
            <div className="text-5xl font-sans font-light mb-4 text-[#00FF55]">
              R$ {Math.ceil(finalPriceClientTotal).toFixed(2).replace('.', ',')}
            </div>

            {appliedCoupon && (
              <div className="text-red-400 text-sm font-bold tracking-wider mb-2 bg-red-900/40 p-2 rounded -mt-2">
                DESCONTO DE CUPOM (-R$ {discountAmount.toFixed(2).replace('.', ',')}) ATIVO
              </div>
            )}

            <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-4 mt-2">
              <span className="text-gray-400">Preço Unitário</span>
              <span className="font-bold text-white">R$ {unitPriceClient.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-400">Lucro Líquido Lote</span>
              <span className="font-bold text-green-400">R$ {totalProfit.toFixed(2).replace('.', ',')}</span>
            </div>

            {/* SLIDERS DE TAXA E MARKUP IN-LIVE */}
            <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Multiplicador (Markup)</span>
                  <span className="font-bold text-white text-sm">x{hasPainting ? markupWithPaint : markupWithoutPaint}</span>
                </div>
                <input
                  type="range" min="1" max="10" step="0.1"
                  value={hasPainting ? markupWithPaint : markupWithoutPaint}
                  onChange={e => hasPainting ? setMarkupWithPaint(Number(e.target.value)) : setMarkupWithoutPaint(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-[#00FF55]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1"><AlertTriangle size={12} /> Taxa de Falha</span>
                  <span className="font-bold text-red-400 text-sm">{(failureRate * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="1"
                  value={failureRate * 100}
                  onChange={e => setFailureRate(Number(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-red-500"
                />
              </div>

            </div>
          </div>

          {/* Discriminativo de Custos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">Custo Total de Produção</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Custos Diretos (Material, Energia)</span>
                <span className="font-medium text-gray-700">R$ {directCosts.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Custos Indiretos (Amortiz., Fixos)</span>
                <span className="font-medium text-gray-700">R$ {indirectCosts.toFixed(2).replace('.', ',')}</span>
              </div>
              {extraCosts > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Custos Extras (Embalagem/Frete)</span>
                  <span className="font-medium text-purple-600">R$ {extraCosts.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2 mb-2 border-dashed border-gray-300">
                <span className="text-gray-500">Custo por Falha Estimada ({Math.round(failureRate * 100)}%)</span>
                <span className="font-medium text-red-400">R$ {failureCost.toFixed(2).replace('.', ',')}</span>
              </div>
              {hasPainting && (
                <div className="flex justify-between border-t pt-2 mt-2 border-dashed">
                  <span className="text-gray-500 font-bold">Total Pintura e Acabamento</span>
                  <span className="font-medium text-blue-600">R$ {paintingCost.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold bg-gray-100 p-2 rounded mt-4">
                <span className="text-gray-800">Custo Total:</span>
                <span className="text-gray-900">R$ {totalCostBeforeMarkup.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Box Plataformas Externas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold mb-4 border-b pb-2 text-gray-500 uppercase tracking-wider">Ajuste para Plataformas</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">Shopee</span>
                  <span className="text-xs text-gray-500">Taxa: {shopeeTax * 100}%</span>
                </div>
                <span className="text-xl font-medium text-orange-500">
                  R$ {Math.ceil(priceShopee).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">Mercado Livre</span>
                  <span className="text-xs text-gray-500">Taxa: {mlTax * 100}%</span>
                </div>
                <span className="text-xl font-medium text-yellow-500">
                  R$ {Math.ceil(priceML).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* --- MODAIS DE CADASTRO --- */}
      {showPrinterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setShowPrinterModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <XCircle size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 font-bebas tracking-wide">Nova Impressora</h2>
            <div className="space-y-3">
              <div>
                 <label className="text-xs uppercase font-bold text-gray-500">Apelido (ex: Elegoo Saturn 3)</label>
                 <input value={newPrinterName} onChange={e => setNewPrinterName(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                 <label className="text-xs uppercase font-bold text-gray-500">Valor da Máquina (R$)</label>
                 <input type="number" step="10" value={newPrinterValue} onChange={e => setNewPrinterValue(Number(e.target.value))} className="w-full p-2 border rounded" />
              </div>
              <div>
                 <label className="text-xs uppercase font-bold text-gray-500">Potência (Watts)</label>
                 <input type="number" value={newPrinterPower} onChange={e => setNewPrinterPower(Number(e.target.value))} className="w-full p-2 border rounded" />
              </div>
              <div>
                 <label className="text-xs uppercase font-bold text-gray-500">Vida Útil (Meses)</label>
                 <input type="number" value={newPrinterLife} onChange={e => setNewPrinterLife(Number(e.target.value))} className="w-full p-2 border rounded" />
              </div>
              <button onClick={handleSavePrinter} className="w-full bg-[#00FF55] text-black font-bold py-2 rounded mt-2 hover:bg-[#00e64d]">SALVAR IMPRESSORA</button>
            </div>
          </div>
        </div>
      )}

      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setShowMaterialModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <XCircle size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 font-bebas tracking-wide">Novo Material</h2>
            <div className="space-y-3">
              <div>
                 <label className="text-xs uppercase font-bold text-gray-500">Marca / Cor (ex: Sunlu ABS Cinza)</label>
                 <input value={newMaterialName} onChange={e => setNewMaterialName(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                 <label className="text-xs uppercase font-bold text-gray-500">Tipo</label>
                 <select value={newMaterialTypeDropdown} onChange={e => setNewMaterialTypeDropdown(e.target.value)} className="w-full p-2 border rounded">
                    <option value="Resina">Resina</option>
                    <option value="Filamento">Filamento (FDM)</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs uppercase font-bold text-gray-500">Preço por KG/Litro (R$)</label>
                 <input type="number" step="0.1" value={newMaterialPrice} onChange={e => setNewMaterialPrice(Number(e.target.value))} className="w-full p-2 border rounded" />
              </div>
              <button onClick={handleSaveMaterial} className="w-full bg-[#00FF55] text-black font-bold py-2 rounded mt-2 hover:bg-[#00e64d]">SALVAR MATERIAL</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PricingCalculator;
