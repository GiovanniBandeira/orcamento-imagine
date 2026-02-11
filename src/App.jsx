import React, { useState } from 'react';
import { Camera, Plus, Trash2, Printer, Phone, Mail, Instagram } from 'lucide-react';

const App = () => {
  // --- Estados do Formulário ---
  const [clientName, setClientName] = useState('Digite aqui: ');
  const [modelName, setModelName] = useState('Digite aqui: ');
  const [creatorName, setCreatorName] = useState('Digite aqui: ');
  const [quantity, setQuantity] = useState(7);
  const [unitPrice, setUnitPrice] = useState(30.00);
  const [selectedSize, setSelectedSize] = useState('M'); // PP, P, M, G, XG
  const [sendDate, setSendDate] = useState(now().toISOString().split('T')[0]); // Data atual como padrão
  const [imageSrc, setImageSrc] = useState(null);
  
  // Lista de itens extras na descrição
  const [extras, setExtras] = useState([
    { description: 'Pintura', value: 0, isIncluded: true },
    { description: 'Acabamento', value: 0, isIncluded: true }
  ]);

  // Contatos fixos
  const [contact, setContact] = useState({
    phone: '(83) 9 9391-3523',
    email: 'imaginehub.oficial@gmail.com',
    instagram: '@imagine.hub_'
  });

  // --- Cálculos ---
  const calculateTotal = () => {
    const productsTotal = quantity * unitPrice;
    const extrasTotal = extras.reduce((acc, item) => {
      return item.isIncluded ? acc : acc + Number(item.value);
    }, 0);
    return productsTotal + extrasTotal;
  };

  // --- Handlers ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (x) => setImageSrc(x.target.result);
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800 flex flex-col lg:flex-row gap-8">
      {/* --- ESTILOS GLOBAIS E DE IMPRESSÃO --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        
        /* Garante que a fonte seja aplicada em tudo dentro do preview */
        .font-bebas {
          font-family: 'Bebas Neue', sans-serif !important;
        }

        /* Estilo para impressão exata */
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

      {/* --- PAINEL DE CONTROLE (Esquerda - Não aparece na impressão) --- */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg h-fit no-print overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Editar Pedido</h2>

        {/* Upload de Imagem */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto (PNG Transparente)</label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition w-full justify-center border border-blue-200 border-dashed">
              <Camera size={20} />
              <span>Escolher Imagem</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            {imageSrc && (
              <button onClick={() => setImageSrc(null)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Cliente</label>
            <input 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Modelo</label>
            <input 
              value={modelName} 
              onChange={(e) => setModelName(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Criador</label>
            <input 
              value={creatorName} 
              onChange={(e) => setCreatorName(e.target.value)} 
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

        {/* Valores e Quantidades */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Quantidade</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Preço Unit. (R$)</label>
            <input 
              type="number" 
              step="0.01"
              value={unitPrice} 
              onChange={(e) => setUnitPrice(Number(e.target.value))} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none" 
            />
          </div>
        </div>

        {/* Tamanhos */}
        <div className="mb-6">
          <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">Tamanho Selecionado</label>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(s => (
              <button
                key={s.label}
                onClick={() => setSelectedSize(s.label)}
                className={`px-3 py-1 rounded border ${selectedSize === s.label ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
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
        <button 
          onClick={() => window.print()} 
          className="w-full bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg"
        >
          <Printer size={20} /> Imprimir / Salvar PDF
        </button>
        <p className="text-xs text-center text-gray-400 mt-2">Dica: Use "Salvar como PDF" na janela de impressão.</p>
      </div>

      {/* --- PREVIEW / ÁREA DE IMPRESSÃO (Direita) --- */}
      <div className="print-container flex-1 flex justify-center overflow-auto bg-gray-200/50 p-4 lg:p-8">
        
        {/* Container A4/Poster */}
        <div className="print-area bg-[#FFF5F7] relative shadow-2xl flex flex-col justify-between overflow-hidden font-bebas"
             style={{ 
               width: '595px', 
               minHeight: '842px', 
               aspectRatio: '1/1.414',
             }}>
          
          {/* Fundo Verde Central */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[160px] h-[65%] bg-[#00FF55] z-0"></div>

          {/* === HEADER === */}
          {/* --- TÍTULO IMAGINE (Editável para Alinhamento) --- */}
          {/* Se precisar ajustar o alinhamento, altere as classes 'text-center' ou 'pt-8' abaixo */}
          <div className="relative z-10 w-full text-center pt-8">
            <h1 className="text-[130px] align-middle leading-[0.8] -tracking-wide text-[#333]">
              IMAGINE
            </h1>
            <p className="text-3xl align-middle tracking-[0.2em] text-[#444] mt-[-14px]">
              ORÇAMENTO DE PEDIDO
            </p>
          </div>

          {/* === CONTEÚDO CENTRAL === */}
          <div className="relative z-10 flex-1 w-full flex flex-col">
            
            {/* Informações Superiores (Modelo e Cliente) */}
            {/* --- POSIÇÃO DO MODELO/CLIENTE (Editável) --- */}
            {/* Ajuste o 'px-4' para mudar a distância da lateral */}
            <div className="flex justify-between items-start px-4 mt-12 w-full">
              
              {/* Esquerda: Modelo */}
              <div className="text-left max-w-[40%]">
                <h2 className="text-4xl leading-none text-[#444] uppercase mb-2">
                  {modelName}
                </h2>
                <div className="text-xl text-gray-500 uppercase font-light leading-none">
                  <span className="text-gray-400 text-2xl">CRIADOR:</span><br/>
                  <span className="text-3xl text-gray-600">{creatorName}</span>
                </div>
              </div>

              {/* Centro: Imagem */}
              {/* Aumentei o z-index para 0 para ficar atrás do texto se necessário, ou ajuste conforme preferência */}
              <div className="absolute left-1/2 top-20 transform -translate-x-1/2 w-[400px] h-[450px] flex items-center justify-center pointer-events-none z-0">
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt="Produto" 
                    className="w-full h-full object-contain"
                    style={{ filter: 'drop-shadow(5px 10px 15px rgba(0,0,0,0.4))' }}
                  />
                ) : (
                  <div className="text-center text-gray-400 opacity-50 text-2xl">
                    [Sem Imagem]
                  </div>
                )}
              </div>

              {/* Direita: Cliente */}
              <div className="text-right max-w-[35%] relative z-10">
                <h2 className="text-4xl text-[#444] uppercase mb-1">
                  CLIENTE
                </h2>
                <p className="text-5xl text-gray-500 uppercase leading-none break-words">
                  {clientName}
                </p>
              </div>
            </div>

            {/* Espaçador para empurrar o resto para baixo */}
            <div className="flex-grow"></div>

            {/* Data de Envio (Reposicionada mais para cima) */}
            {/* Ajuste o 'bottom-[xxx]' para subir ou descer a data */}
            <div className="absolute bottom-[350px] right-6 text-right z-20">
               <p className="text-xl text-gray-500 mb-0 leading-none">DATA DE ENVIO</p>
               <p className="text-3xl text-[#333] leading-none">{formatDate(sendDate)}</p>
            </div>

            {/* === ÁREA INFERIOR (Grid de Info) === */}
            {/* Reduzi o padding lateral para px-4 (era px-8) para aproximar da margem */}
            <div className="w-full pt-2 px-4 relative z-20 bg-gradient-to-b from-[#FFF5F7]">
              <div className="flex gap-4 items-end">
                
                {/* COLUNA ESQUERDA: Descrições e Totais */}
                <div className="flex-1">
                  
                  {/* Tabela de Descrições (Sem texto vertical) */}
                  <div className="flex items-stretch mb-6">
                    <div className="flex-1">
                      {/* Cabeçalho */}
                      <div className="bg-[#444] text-white flex text-lg px-2 py-1">
                        <span className="flex-1 text-center border-r border-gray-500 pl-2">DESCRIÇÃO</span>
                        <span className="w-32 text-center">VALORES (R$)</span>
                      </div>
                      
                      {/* Linhas */}
                      <div className="border-l border-r border-b border-gray-300 bg-white/80 min-h-[80px]">
                        {extras.map((item, idx) => (
                          <div key={idx} className="flex text-xl border-b border-gray-100 last:border-0 items-center">
                            <span className="flex-1 px-3 py-1 text-gray-700 uppercase">{item.description}</span>
                            <span className="w-32 px-2 py-1 text-center text-gray-600 bg-gray-50/50">
                              {item.isIncluded ? 'Incluso' : item.value.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Totais */}
                  <div className="space-y-1 ml-auto w-full max-w-[400px]">
                    <div className="flex items-center justify-start">
                       <span className="text-4xl text-gray-500 text-right pr-10">QUANTIDADE</span>
                       <div className="border border-gray-400 w-40 text-center text-3xl py-0.5 bg-white text-gray-700">
                         {quantity}
                       </div>
                    </div>
                    <div className="flex items-center justify-start">
                       <span className="text-4xl text-gray-500 text-right pr-11">PREÇO UNIT.</span>
                       <div className="border border-gray-400 w-40 text-center text-3xl py-0.5 bg-white font-bold text-gray-700">
                         R$ {unitPrice.toFixed(2).replace('.', ',')}
                       </div>
                    </div>
                    <div className="flex items-center justify-start">
                       <span className="text-4xl text-gray-500 text-right pr-9">VALOR TOTAL</span>
                       <div className="border border-gray-400 w-40 text-center text-3xl py-0.5 bg-white font-bold text-gray-700">
                         {formatCurrency(calculateTotal())}
                       </div>
                    </div>
                  </div>

                </div>

                {/* COLUNA DIREITA: Tamanhos */}
                <div className="w-[160px] border-l border-black pl-4 pb-1">
                  <h3 className="text-5xl text-[#333] text-center mb-2 leading-none">TAMANHO</h3>
                  
                  <div className="flex flex-col gap-1">
                    {sizes.map((size) => {
                      const isSelected = selectedSize === size.label;
                      return (
                        <div key={size.label} className="flex items-center justify-end gap-2">
                          <span className="text-gray-500 text-xl">{size.range}</span>
                          <div 
                            className={`
                              w-10 h-10 border-2 border-[#444] flex items-center justify-center 
                              text-2xl cursor-pointer
                              ${isSelected ? 'bg-[#333] text-white' : 'text-[#333] bg-transparent'}
                            `}
                            onClick={() => setSelectedSize(size.label)} // Adicionei clique aqui também
                          >
                            {size.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

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

export default App;