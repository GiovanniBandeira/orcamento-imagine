import React, { useState, useEffect } from 'react';
import { Calculator, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingCalculator = () => {
  const navigate = useNavigate();
  
  // TIPO DE MATERIAL
  const [materialType, setMaterialType] = useState('Resina'); // Resina ou Filamento

  // ENTRADAS DA PEÇA
  const [modelName, setModelName] = useState('');
  const [printTime, setPrintTime] = useState(1); // horas
  const [weight, setWeight] = useState(10); // gramas
  
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

  // Atualiza placeholders dependendo do tipo selecionado (baseado na planilha)
  useEffect(() => {
    if (materialType === 'Filamento') {
       setExpectedRevenue(300);
       setAlcoholCost(28.90);
       setPrinterValue(1500.00);
       setPrinterLifeMonths(24);
       setSprayYield(30);
       setMarkupWithoutPaint(2.5);
       setMarkupWithPaint(2.5);
       setFailureRate(0.1);
    } else {
       setExpectedRevenue(400);
       setAlcoholCost(5.00);
       setPrinterValue(1180.10);
       setPrinterLifeMonths(18);
       setSprayYield(20);
       setMarkupWithoutPaint(4);
       setMarkupWithPaint(2);
       setFailureRate(0.2);
    }
  }, [materialType]);

  // -------- CÁLCULOS PASSO A PASSO (IDÊNTICOS AO EXCEL) -------- //
  
  // 1. Custo Fixo Dissolvido
  const totalFixedCost = internet + software;
  const fixedCostDissolved = expectedRevenue > 0 ? totalFixedCost / expectedRevenue : 0; 
  
  // 2. Amortização
  const totalAmortization = printerLifeMonths > 0 ? printerValue / printerLifeMonths : 0;
  
  // 3. Custos Diretos e Indiretos
  const materialCost = (materialKgPrice / 1000) * weight; // Custo do material usado
  const powerCostInKw = (printerPower / 1000); // 42w = 0.042kw
  const energyCost = powerCostInKw * printTime * kwhCost; 
  
  const directCosts = materialCost + energyCost + alcoholCost;
  const indirectCosts = fixedCostDissolved + totalAmortization;
  
  const totalProductCostRaw = directCosts + indirectCosts;
  const failureCost = totalProductCostRaw * failureRate;
  
  const finalProductCost = totalProductCostRaw + failureCost; // Custo Total do Produto (Sem Pintura)

  // 4. Custos de Pintura
  let paintingCost = 0;
  if (hasPainting) {
     const acrylic = ACRYLIC_PAINT_COST[paintingLevel] || 0;
     const primerPerPiece = sprayYield > 0 ? primerCost / sprayYield : 0;
     const varnishPerPiece = sprayYield > 0 ? varnishCost / sprayYield : 0;
     const laborCost = (PAINTER_TIME[paintingLevel] || 0) * painterHourCost;
     
     paintingCost = acrylic + primerPerPiece + varnishPerPiece + laborCost;
  }

  // 5. Preço Final (Com ou Sem Pintura)
  const currentMarkup = hasPainting ? markupWithPaint : markupWithoutPaint;
  const totalCostBeforeMarkup = finalProductCost + paintingCost;
  
  const finalPriceClient = totalCostBeforeMarkup * currentMarkup;
  const profit = finalPriceClient - totalCostBeforeMarkup;

  // Calculo Plataformas
  const priceShopee = finalPriceClient / (1 - shopeeTax);
  const priceML = finalPriceClient / (1 - mlTax);

  // Ação de Enviar para Orçamento
  const handleGenerateQuote = () => {
     navigate('/', { 
       state: { 
         modelName: modelName || 'Produto 3D',
         unitPrice: Math.ceil(finalPriceClient),
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
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2"><ShoppingBag size={20}/> Dados da Impressão</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <label className="text-xs uppercase font-bold text-gray-500">Taxa de Falha (%)</label>
                    <input type="number" step="0.01" value={failureRate * 100} onChange={e => setFailureRate(Number(e.target.value)/100)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00FF55] outline-none" />
                  </div>
                </div>
             </div>

             {/* Custos da Máquina e Material */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Custos Operacionais</h2>
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
             
             {/* Box Principal de Preço */}
             <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF55] opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                
                <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">Preço Final - Cliente</h3>
                <div className="text-5xl font-sans font-light mb-4 text-[#00FF55]">
                   R$ {Math.ceil(finalPriceClient).toFixed(2).replace('.', ',')}
                </div>
                
                <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-4 mt-2">
                   <span className="text-gray-400">Lucro Líquido Estimado</span>
                   <span className="font-bold text-green-400">R$ {profit.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-gray-400">Markup Definido</span>
                     <input type="number" step="0.1" value={hasPainting ? markupWithPaint : markupWithoutPaint} 
                            onChange={e => hasPainting ? setMarkupWithPaint(Number(e.target.value)) : setMarkupWithoutPaint(Number(e.target.value))} 
                            className="w-16 p-1 text-right bg-gray-800 border border-gray-700 rounded text-white text-sm outline-none" />
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
                   <div className="flex justify-between">
                     <span className="text-gray-500">Custo por Falha Estimada ({failureRate*100}%)</span>
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
    </div>
  );
};

export default PricingCalculator;
