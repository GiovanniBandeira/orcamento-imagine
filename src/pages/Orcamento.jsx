import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, Trash2, Printer, Phone, Mail, Instagram, Download } from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image';
import { jsPDF } from 'https://esm.sh/jspdf';
import { useLocation } from 'react-router-dom';

const Orcamento = () => {
  const location = useLocation();
  // --- Estados do Formulário ---
  const [clientName, setClientName] = useState('');
  const [sendDate, setSendDate] = useState(new Date().toISOString().split('T')[0]); // Data atual como padrão

  // Estrutura Base de Múltiplos Modelos
  const emptyModel = {
    id: Date.now().toString(),
    modelName: '',
    creatorName: '',
    quantity: 1,
    unitPrice: 0.00,
    selectedSize: 'PP',
    imageSrc: null
  };

  const [models, setModels] = useState([{ ...emptyModel }]);

  // Referência para a área de captura e estado de carregamento
  const printRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Lista de itens extras na descrição
  const [extras, setExtras] = useState([
    { description: 'Pintura', value: 0, isIncluded: true },
    { description: 'Acabamento', value: 0, isIncluded: true }
  ]);

  // Se vier por redirecionamento do Precificador, preencher o primeiro item
  useEffect(() => {
    if (location.state) {
      const initialModel = { ...emptyModel };
      if (location.state.modelName) initialModel.modelName = location.state.modelName;
      if (location.state.unitPrice) initialModel.unitPrice = location.state.unitPrice;

      setModels([initialModel]);

      // Ajustar pintura baseada no fato de ter tido custo com pintura no calculo
      if (location.state.hasPainting === false) {
        setExtras([
          { description: 'Limpeza e Cura', value: 0, isIncluded: true },
          { description: 'Peça Crua (Sem Pintura)', value: 0, isIncluded: true }
        ]);
      } else {
        setExtras([
          { description: 'Pintura', value: location.state.paintingCost || 0, isIncluded: true },
          { description: 'Acabamento', value: 0, isIncluded: true }
        ]);
      }
    }
  }, [location.state]);

  // Contatos fixos
  const [contact, setContact] = useState({
    phone: '(83) 9 9391-3523',
    email: 'imaginehub.oficial@gmail.com',
    instagram: '@imagine.hub_'
  });

  // --- Cálculos ---
  const calculateTotal = () => {
    const productsTotal = models.reduce((acc, mod) => acc + (Number(mod.quantity) * Number(mod.unitPrice)), 0);
    const extrasTotal = extras.reduce((acc, item) => {
      return item.isIncluded ? acc : acc + Number(item.value);
    }, 0);
    return productsTotal + extrasTotal;
  };

  // --- Handlers de Múltiplos Modelos ---
  const handleAddModel = () => {
    setModels([...models, { ...emptyModel, id: Date.now().toString() }]);
  };

  const handleRemoveModel = (id) => {
    if (models.length === 1) return; // Não deixa excluir o último
    setModels(models.filter(m => m.id !== id));
  };

  const updateModelField = (id, field, value) => {
    setModels(models.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleModelImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (x) => {
        updateModelField(id, 'imageSrc', x.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExtra = () => {
    setExtras([...extras, { description: 'Novo Item', value: 0, isIncluded: false }]);
  };

  const removeExtra = (index) => {
    const newExtras = [...extras];
    newExtras.splice(index, 1);
    setExtras(newExtras);
  };

  const updateExtra = (index, field, value) => {
    const newExtras = [...extras];
    newExtras[index][field] = value;
    if (field === 'isIncluded' && value === true) {
      newExtras[index].value = 0;
    }
    setExtras(newExtras);
  };

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const sizes = [
    { label: 'PP', range: '< 50 mm' },
    { label: 'P', range: '50 a 80 mm' },
    { label: 'M', range: '80 a 150 mm' },
    { label: 'G', range: '150 a 250 mm' },
    { label: 'XG', range: '> 250 mm' },
  ];

  // Lógica de exportação simplificada e imune a falhas usando renderização nativa
  const handleExport = async (format) => {
    if (!printRef.current) return;
    setIsExporting(true);

    try {
      // Garante que a fonte carregou completamente para o navegador desenhar certo
      await document.fonts.ready;

      const node = printRef.current;
      const fileName = `Orcamento_${clientName || 'Cliente'}`;

      if (format === 'pdf') {
        // html-to-image copia 100% igual a tela nativamente
        const imgData = await htmlToImage.toPng(node, { pixelRatio: 2, backgroundColor: '#FFF5F7' });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (node.offsetHeight * pdfWidth) / node.offsetWidth;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
      } else if (format === 'png') {
        const imgData = await htmlToImage.toPng(node, { pixelRatio: 2, backgroundColor: '#FFF5F7' });
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'jpg') {
        const imgData = await htmlToImage.toJpeg(node, { quality: 1.0, pixelRatio: 2, backgroundColor: '#FFF5F7' });
        const link = document.createElement('a');
        link.download = `${fileName}.jpg`;
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro ao exportar o arquivo:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800 flex flex-col lg:flex-row gap-8">
      {/* --- ESTILOS GLOBAIS E DE IMPRESSÃO --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        
        /* Garante que a fonte seja aplicada em tudo dentro do preview */
        .font-bebas {
          font-family: 'Bebas Neue', sans-serif !important;
        }

        @media print {
          @page { 
            size: A4; 
            margin: 0; 
          }
          body { 
            background: white;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          /* Esconde tudo que não for a área de impressão */
          body > *:not(.print-container) { 
            display: none !important; 
          }
          /* Força a exibição do container de impressão */
          .print-container {
            display: flex !important;
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #FFF5F7 !important;
            z-index: 9999;
          }
          /* Ajustes de layout para impressão */
          .print-area {
            box-shadow: none !important;
            width: 100% !important;
            min-height: 100vh !important;
          }
        }
      `}</style>

      {/* --- PAINEL DE CONTROLE (Esquerda) --- */}
      <div className="w-full lg:w-[400px] bg-white p-6 rounded-xl shadow-lg h-fit no-print overflow-y-auto max-h-[calc(100vh-2rem)] flex-shrink-0">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Editar Pedido</h2>

        {/* Informações Básicas (Gerais do Pedido) */}
        <div className="grid grid-cols-1 gap-4 mb-6 border-b pb-4">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Cliente</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Data de Envio</label>
            <input
              type="date"
              value={sendDate}
              onChange={(e) => setSendDate(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
        </div>

        {/* --- LISTA DE MODELOS --- */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm uppercase font-bold text-gray-700">Modelos Inclusos</h3>
          <button onClick={handleAddModel} className="text-xs bg-[#00FF55] hover:bg-[#00e64d] text-black font-bold px-3 py-1 rounded flex items-center gap-1 background-color: black">
            <Plus size={14} /> Modelo
          </button>
        </div>

        <div className="space-y-6 mb-6">
          {models.map((mod, index) => (
            <div key={mod.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 relative text-white">
              {models.length > 1 && (
                <button
                  onClick={() => handleRemoveModel(mod.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-white rounded-full p-1 border shadow-sm"
                  title="Remover Modelo"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <h4 className="text-xs font-bold text-gray-300 mb-3">Item #{index + 1}</h4>

              {/* Upload de Imagem Individual */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Imagem do Produto (PNG)</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition w-full justify-center border border-blue-200 border-dashed text-sm">
                    <Camera size={16} /> <span>{mod.imageSrc ? 'Trocar' : 'Inserir'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleModelImageUpload(mod.id, e)} />
                  </label>
                  {mod.imageSrc && (
                    <button onClick={() => updateModelField(mod.id, 'imageSrc', null)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Informações Numéricas do Item */}
              <div className="grid grid-cols-1 gap-3 mb-3">
                <div>
                  <input
                    placeholder="Nome do Modelo"
                    value={mod.modelName}
                    onChange={(e) => updateModelField(mod.id, 'modelName', e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-[#00FF55] outline-none text-sm placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    placeholder="Nome do Criador (Studio)"
                    value={mod.creatorName}
                    onChange={(e) => updateModelField(mod.id, 'creatorName', e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-[#00FF55] outline-none text-sm placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">QTD</label>
                  <input
                    type="number" min="1"
                    value={mod.quantity}
                    onChange={(e) => updateModelField(mod.id, 'quantity', Number(e.target.value))}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Unitário (R$)</label>
                  <input
                    type="number" step="0.01"
                    value={mod.unitPrice}
                    onChange={(e) => updateModelField(mod.id, 'unitPrice', Number(e.target.value))}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white outline-none text-sm"
                  />
                </div>
              </div>

              {/* Tamanhos Individuais */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Tamanho Escala</label>
                <div className="flex gap-1 flex-wrap">
                  {sizes.map(s => (
                    <button
                      key={s.label}
                      onClick={() => updateModelField(mod.id, 'selectedSize', s.label)}
                      className={`px-2 py-1 rounded border text-xs ${mod.selectedSize === s.label ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Descrições Extras */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs uppercase font-bold text-gray-500">Itens / Descrição</label>
            <button onClick={addExtra} className="text-green-600 text-xs flex items-center gap-1 hover:underline">
              <Plus size={14} /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {extras.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center text-sm">
                <input
                  value={item.description}
                  onChange={(e) => updateExtra(idx, 'description', e.target.value)}
                  className="flex-1 p-1 border rounded"
                  placeholder="Descrição"
                />
                <select
                  value={item.isIncluded}
                  onChange={(e) => updateExtra(idx, 'isIncluded', e.target.value === 'true')}
                  className="p-1 border rounded w-24 text-xs"
                >
                  <option value="true">Incluso</option>
                  <option value="false">Valor</option>
                </select>
                {!item.isIncluded && (
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateExtra(idx, 'value', Number(e.target.value))}
                    className="w-20 p-1 border rounded"
                    placeholder="R$"
                  />
                )}
                <button onClick={() => removeExtra(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 mt-4 border-t pt-4">
          <span className="text-xs uppercase font-bold text-gray-500 text-center">Exportar Arquivo</span>

          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
          >
            <Printer size={20} /> {isExporting ? 'Processando...' : 'Exportar PDF'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handleExport('png')}
              disabled={isExporting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow disabled:opacity-50"
            >
              <Download size={18} /> PNG
            </button>
            <button
              onClick={() => handleExport('jpg')}
              disabled={isExporting}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition shadow disabled:opacity-50"
            >
              <Download size={18} /> JPG
            </button>
          </div>
        </div>
      </div>

      {/* --- PREVIEW / ÁREA DE IMPRESSÃO (Direita) --- */}
      <div className="flex-1 flex justify-center items-start overflow-auto bg-gray-200/50 p-4 lg:p-8 rounded-xl relative overflow-x-auto min-w-[700px]">

        {/* Usando transform para escalar o preview visualmente na tela sem alterar o tamanho real interno (que o html2canvas usa para exportação) */}
        <div className="origin-top transform scale-[0.6] sm:scale-75 md:scale-[0.85] lg:scale-100 transition-transform">
          <div ref={printRef} className="print-area bg-[#FFF5F7] relative shadow-2xl flex flex-col font-bebas overflow-hidden"
            style={{
              width: '595px',
              minHeight: '842px',
              aspectRatio: '1/1.414',
            }}>

            {/* Fundo Verde Central */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[180px] h-[65%] bg-[#00FF55] z-0"></div>

            {/* === HEADER === */}
            {/* --- TÍTULO IMAGINE (Editável para Alinhamento) --- */}
            {/* Se precisar ajustar o alinhamento, altere as classes 'text-center' ou 'pt-8' abaixo */}
            <div className="relative z-10 w-full text-center pt-8">
              <h1 className="text-[120px] leading-[0.8] tracking-tighter text-[#333]">
                IMAGINE
              </h1>
              <p className="text-3xl tracking-[0.25em] text-[#444] mt-[-14px] ml-4">
                ORÇAMENTO DE PEDIDO
              </p>
            </div>

            {/* ========================================================= */}
            {/* LÓGICA DE EXIBIÇÃO: 1 ÚNICO MODELO vs MÚLTIPLOS MODELOS */}
            {/* ========================================================= */}

            {models.length === 1 ? (
              // ---------------- LAYOUT CLÁSSICO (1 MODELO) ---------------- //
              <>
                <div className="flex justify-between items-start px-4 mt-12 w-full">
                  <div className="text-left max-w-[40%]">
                    <h2 className="text-6xl leading-none text-[#444] uppercase pt-3 mb-2">
                      {models[0]?.modelName || 'MODELO'}
                    </h2>
                    <div className="text-xl text-gray-500 pt-20 uppercase font-light leading-none">
                      <span className="text-gray-400 text-4xl">CRIADOR:</span><br />
                      <span className="text-5xl text-[#444]">{models[0]?.creatorName || 'CRIADOR'}</span>
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-30 transform -translate-x-1/2 w-[400px] h-[450px] flex items-center justify-center pointer-events-none z-0">
                    {models[0]?.imageSrc ? (
                      <img
                        src={models[0].imageSrc}
                        alt="Produto"
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(5px 10px 15px rgba(0,0,0,0.4))' }}
                      />
                    ) : (
                      <div className="text-center text-gray-400 opacity-50 text-2xl">[Sem Imagem]</div>
                    )}
                  </div>

                  <div className="text-right max-w-[35%] relative z-10">
                    <h2 className="text-5xl text-gray-500 uppercase mb-1">CLIENTE</h2>
                    <p className="text-6xl text-[#444] uppercase leading-none break-words">{clientName}</p>
                  </div>
                </div>

                <div className="flex-grow"></div>

                <div className="absolute bottom-[300px] right-6 text-right z-20">
                  <p className="text-3xl text-gray-500 mb-0 leading-none">DATA DE ENVIO</p>
                  <p className="text-4xl text-[#333] leading-none">{formatDate(sendDate)}</p>
                </div>

                <div className="w-full relative bg-[#FFF5F7] px-4 py-4 -mt-20 z-100">
                  <div className="flex gap-2 items-end border-t border-gray-200 pt-2">

                    <div className="flex-1 my-0">
                      <div className="flex items-stretch mb-6">
                        <div className="flex-1">
                          <div className="bg-[#444] text-white flex text-lg">
                            <span className="flex-1 text-center border-r border-gray-500 pl-2">DESCRIÇÃO EXTRA</span>
                            <span className="w-32 text-center">VALORES (R$)</span>
                          </div>
                          <div className="border-l border-r border-b border-gray-300 bg-white/80 min-h-[60px]">
                            {extras.map((item, idx) => (
                              <div key={idx} className="flex text-2xl border-b border-gray-100 last:border-0 items-center">
                                <span className="flex-1 px-5 py-1 text-gray-700 uppercase">{item.description}</span>
                                <span className="w-32 px-2 py-1 text-center text-gray-600 bg-gray-50/50">
                                  {item.isIncluded ? 'Incluso' : item.value.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 my-2 ml-auto w-full max-w-[400px] px-10">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-4xl text-gray-700 text-left">QUANTIDADE</span>
                          <div className="border border-gray-400 w-40 text-center text-3xl py-1 bg-white text-gray-500">
                            {models[0]?.quantity || 1}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-4xl text-gray-700 text-left">PREÇO UNIT.</span>
                          <div className="border border-gray-400 w-40 text-center text-3xl py-1 bg-white text-gray-500">
                            R$ {Number(models[0]?.unitPrice || 0).toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-4xl text-gray-700 text-left">VALOR TOTAL</span>
                          <div className="border border-gray-400 w-40 text-center text-3xl py-1 bg-white text-gray-500">
                            {formatCurrency(calculateTotal())}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-[200px] border-l border-[#333] pb-1">
                      <h3 className="text-6xl text-[#333] text-center align-middle leading-none">TAMANHO</h3>
                      <div className="flex flex-col gap-0" >
                        {sizes.map((size) => {
                          const isSelected = models[0]?.selectedSize === size.label;
                          return (
                            <div key={size.label} className="flex items-center justify-end gap-2 mx-4 py-1">
                              <span className="text-gray-500 text-2xl">{size.range}</span>
                              <div className={`w-10 h-10 border-2 border-[#444] flex items-center justify-center text-2xl ${isSelected ? 'bg-[#333] text-white' : 'text-[#333] bg-transparent'}`}>
                                {size.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // ---------------- LAYOUT LISTA PROFISSIONAL (MÚLTIPLOS MODELOS - PREMIUM) ---------------- //
              <div className="w-full flex-1 flex flex-col relative z-10 bg-[#FFF5F7] overflow-hidden">

                {/* Watermark Logo Imagine bg */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-[0.03] space-y-10">
                  <h1 className="text-[250px] font-bold text-black tracking-tighter transform -rotate-12">IMAGINE 3D</h1>
                  <h1 className="text-[250px] font-bold text-black tracking-tighter transform -rotate-12 outline-text">ORÇAMENTO</h1>
                </div>

                {/* Cabeçalho do Cliente e Data Premium */}
                <div className="flex justify-between items-start px-8 mt-10 w-full relative z-10 mb-6">
                  <div className="text-left w-[55%] border-l-8 border-[#00FF55] pl-4">
                    <div className="inline-block bg-[#222] text-[#00FF55] text-2xl px-3 py-1 mb-2 tracking-widest font-bold">ORÇAMENTO MULTI-ITENS</div>
                    <p className="text-6xl text-[#333] uppercase leading-none font-bold break-words">{clientName || 'NÃO INFORMADO'}</p>
                  </div>
                  <div className="text-right bg-white p-4 shadow border border-gray-200 min-w-[200px]">
                    <p className="text-3xl text-gray-400 mb-1 leading-none uppercase">DATA DE ENVIO</p>
                    <p className="text-5xl text-[#222] leading-none font-bold drop-shadow-sm border-b-4 border-[#00FF55] inline-block pb-1">
                      {formatDate(sendDate)}
                    </p>
                  </div>
                </div>

                {/* Tabela de Produtos */}
                <div className="w-full px-8 flex-1 flex flex-col relative z-10">

                  <div className="bg-[#222] border-t-4 border-[#00FF55] text-white flex text-3xl px-4 py-3 uppercase tracking-wider items-center shadow-md">
                    <span className="w-24 text-center text-[#00FF55] font-bold">FOTO</span>
                    <span className="flex-1 text-left pl-6">MODELO & CRIADOR</span>
                    <span className="w-32 text-center">TAMANHO</span>
                    <span className="w-20 text-center">QTD</span>
                    <span className="w-32 text-center text-[#00FF55]">V. UNIT</span>
                    <span className="w-32 text-center">TOTAL</span>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    {models.map((mod, i) => (
                      <div key={mod.id} className="flex items-center text-3xl bg-white border border-gray-200 py-3 px-4 shadow-sm relative overflow-hidden group">
                        {/* Linha Verde Acentsquerda */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#00FF55]"></div>

                        <div className="w-24 h-24 flex items-center justify-center bg-gray-50 border border-gray-100 p-1 shadow-inner relative ml-2">
                          {mod.imageSrc ? (
                            <img src={mod.imageSrc} className="w-full h-full object-contain drop-shadow-md" alt="miniatura" />
                          ) : (
                            <span className="text-sm text-gray-400 text-center uppercase tracking-widest leading-tight">SEM<br />FOTO</span>
                          )}
                        </div>
                        <div className="flex-1 text-left pl-6 flex flex-col justify-center gap-1 border-r border-gray-100 pr-4">
                          <span className="text-4xl font-bold text-[#222] leading-none uppercase truncate">{mod.modelName || 'MODELO'}</span>
                          <span className="text-2xl text-gray-500 leading-none uppercase truncate">{mod.creatorName || 'CRIADOR'}</span>
                        </div>
                        <span className="w-32 text-center font-bold text-gray-700 text-3xl bg-gray-50 py-1 rounded-sm mx-2">{mod.selectedSize}</span>
                        <span className="w-20 text-center text-[#222] bg-[#00FF55] font-bold shadow-sm py-1 mx-2">{mod.quantity}x</span>
                        <span className="w-32 text-center text-gray-500 text-3xl font-light">R$ {Number(mod.unitPrice || 0).toFixed(2).replace('.', ',')}</span>
                        <span className="w-32 text-center ml-2 font-bold text-[#222] text-3xl block">R$ {(Number(mod.quantity) * Number(mod.unitPrice || 0)).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Serviços Adicionais (Extras) */}
                  {extras.filter(e => e.value > 0 || e.isIncluded).length > 0 && (
                    <div className="mt-6 flex justify-end">
                      <div className="w-[60%]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-px bg-gray-300 flex-1"></div>
                          <h3 className="text-3xl text-gray-500 tracking-widest font-bold">SERVIÇOS ADICIONAIS</h3>
                        </div>
                        <div className="bg-white border-l-4 border-[#222] shadow-sm">
                          {extras.map((item, idx) => (
                            <div key={idx} className="flex text-2xl border-b border-gray-100 last:border-0 items-center px-4 py-2">
                              <span className="flex-1 text-gray-600 uppercase">{item.description}</span>
                              <span className="w-32 text-right text-[#222] font-bold bg-gray-100 px-2 py-1 rounded-sm">
                                {item.isIncluded ? 'INCLUSO' : `R$ ${item.value.toFixed(2).replace('.', ',')}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex-grow"></div>

                  {/* Resumo Final Premium (Total Box) */}
                  <div className="w-full flex justify-end items-center align-center mt-8 mb-6 pb-4">
                    <span className="text-5xl text-gray-500 tracking-widest mr-4">TOTAL DO PEDIDO:</span>
                    <div className="bg-[#222] border-l-8 border-[#00FF55] text-white text-7xl px-8 py-4 shadow-2xl font-bold tracking-wider relative overflow-hidden flex items-center">
                      <span className="relative z-10 text-[#00FF55] mr-2 text-6xl">R$</span>
                      <span className="relative z-10">{formatCurrency(calculateTotal()).replace('R$', '').trim()}</span>

                      {/* Listras Estilizadas no Fundo Escuro */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)' }}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-1/2"></div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* === FOOTER (Ícones Corrigidos) === */}
            <div className="bg-[#333] w-full py-3 px-6 flex justify-between items-center mt-2 z-20">
              <div className="flex items-center gap-2 text-white tracking-wide text-xl">
                <Phone size={24} strokeWidth={2.5} />
                <span className="mt-1">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-white tracking-wide text-xl">
                <Mail size={24} strokeWidth={2.5} />
                <span className="mt-1">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-white tracking-wide text-xl">
                <Instagram size={24} strokeWidth={2.5} />
                <span className="mt-1">{contact.instagram}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orcamento;