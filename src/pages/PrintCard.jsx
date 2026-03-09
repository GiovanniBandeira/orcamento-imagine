import React, { useState, useRef } from 'react';
import { Download, Info, QrCode } from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image';
import { jsPDF } from 'https://esm.sh/jspdf';

const PrintCard = () => {
  const [discountCode, setDiscountCode] = useState('PIX10OFF');
  const [discountText, setDiscountText] = useState('Ganhe 10% OFF pagando via PIX no próximo pedido!');
  const [instagram, setInstagram] = useState('@imagine.hub_');
  
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef(null);

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    
    try {
      await document.fonts.ready;
      
      const node = printRef.current;
      const fileName = `Cartao_Imagine_10x15cm`;

      // Gerar imagem em alta resolução
      const imgData = await htmlToImage.toPng(node, { pixelRatio: 3, backgroundColor: '#EBEBEB' });
      
      // Criar PDF no formato Exato do Cartão Postal (100mm x 150mm Aberto, Focaremos em Exportar a Frente e Verso em 1 pdf)
      // Como o design renderiza a Frente Encima e o Verso Embaixo visualmente, exportaremos exatamente como está!
      // Ou seja, um PDF longo contendo as duas faces caso o usuário queira mandar pra gráfica já "emendado" ou cortar no meio.
      // O tamanho de 10x15cm (vertical) = 100x150mm. Com as 2 peças empilhadas dá 100x300mm.
      
      const pdf = new jsPDF('p', 'mm', [100, 300]); 
      pdf.addImage(imgData, 'PNG', 0, 0, 100, 300);
      pdf.save(`${fileName}.pdf`);
      
    } catch (error) {
      console.error('Erro ao exportar o cartão:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 font-sans text-gray-800 flex flex-col xl:flex-row gap-8 min-h-screen">
      
      {/* PAINEL DE CONTROLE LATERAL */}
      <div className="w-full xl:w-1/3 bg-white p-6 rounded-xl shadow-lg h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Cartão de Agradecimento (10x15cm)</h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-sm text-yellow-800 rounded">
           <div className="flex items-start gap-2">
              <Info size={20} className="mt-0.5 flex-shrink-0" />
              <p>O cartão será gerado na proporção exata de <strong>10x15cm</strong> vertical. A "Frente" contém informações e o cupom de recompra, e o "Verso" contém os Cuidados 3D.</p>
           </div>
        </div>

        {/* Textos Principais */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Instagram</label>
            <input 
              value={instagram} 
              onChange={(e) => setInstagram(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Código do Cupom</label>
            <input 
              value={discountCode} 
              onChange={(e) => setDiscountCode(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none uppercase font-mono font-bold" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Mensagem do Cupom Secundária</label>
            <textarea 
              value={discountText} 
              onChange={(e) => setDiscountText(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none resize-none h-20" 
            />
          </div>
        </div>

        {/* Ações */}
        <div className="mt-4 border-t pt-4">
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
          >
            <Download size={20} /> {isExporting ? 'Processando...' : 'Exportar FRENTE/VERSO (PDF)'}
          </button>
        </div>
      </div>

      {/* ÁREA DE PRÉ-VISUALIZAÇÃO COMPLETA */}
      <div className="flex-1 flex flex-col bg-gray-200/50 p-4 rounded-xl items-center pb-20 overflow-x-auto relative">
        <h3 className="text-gray-500 mb-6 font-medium">Pré-Visualização Real (Alta Resolução)</h3>
        
        {/* Container Escalado do Cartão (1080px = 10cm | 1620px = 15cm em Proporção) */}
        <div className="relative shadow-2xl flex-shrink-0 origin-top transform scale-[0.4] sm:scale-50 md:scale-[0.55] lg:scale-[0.6] transition-transform">
           
           <div ref={printRef} className="flex flex-col gap-[2px] bg-red-400 border-[1px] border-dashed border-red-500">
             
             {/* ======================= */}
             {/*       FRENTE (10x15)    */}
             {/* ======================= */}
             <div className="w-[1080px] h-[1620px] bg-[#EBEBEB] relative font-bebas flex flex-col overflow-hidden">
                {/* Linha Lateral Verde */}
                <div className="absolute top-0 right-0 w-[40px] h-full bg-[#00FF55]"></div>
                
                {/* CABEÇALHO */}
                <div className="flex flex-col items-center pt-24 z-10 w-full px-20">
                   <h1 className="text-[180px] leading-none tracking-tight text-[#444] text-center w-full">
                     SUA IMAGINAÇÃO<br/>TOMOU FORMA!
                   </h1>
                   <div className="w-full h-[3px] bg-[#bbb] mt-10"></div>
                </div>

                {/* CORPO FRENTE */}
                <div className="flex-1 flex flex-col items-center justify-center px-16 -mt-20">
                    <p className="font-sans text-[45px] text-[#444] text-center mb-16 font-light leading-snug">
                       MUITO OBRIGADO POR CONFIAR NO NOSSO TRABALHO.<br/>SUA PEÇA FOI FEITA COM MUITO CUIDADO E DEDICAÇÃO!
                    </p>

                    {/* Bloco de Cupom */}
                    <div className="w-[800px] border-4 border-[#00FF55] border-dashed bg-white p-10 flex flex-col items-center justify-center relative shadow-lg">
                       {/* Distintivo Superior */}
                       <div className="absolute -top-[50px] bg-[#00FF55] text-black px-10 py-3 text-[50px] tracking-widest font-bold">
                          PRESENTE EXCLUSIVO
                       </div>
                       
                       <p className="font-sans text-[30px] text-gray-500 mb-6 mt-4 text-center px-10">
                         {discountText}
                       </p>
                       <div className="bg-[#EBEBEB] w-full py-6 text-center border-[2px] border-[#333]">
                          <span className="text-[120px] tracking-wider text-[#333] leading-none font-sans font-black">
                            {discountCode}
                          </span>
                       </div>
                       <p className="font-sans text-[20px] text-gray-400 mt-6 text-center italic">
                         * Válido apenas para compras realizadas diretamente pelo WhatsApp ou Direct.
                       </p>
                    </div>
                </div>

                {/* RODAPÉ FRENTE */}
                <div className="w-full bg-[#333] h-[160px] flex items-center justify-between px-16 z-20">
                   <div className="flex items-center gap-6 text-white text-[45px] font-sans font-light tracking-wide">
                      <QrCode size={70} color="#00FF55" />
                      <div className="flex flex-col leading-none">
                         <span className="text-[#00FF55] font-bold">MARQUE A GENTE!</span>
                         <span>{instagram}</span>
                      </div>
                   </div>
                   
                   {/* Logo Simplificada */}
                   <span className="text-white text-[80px] font-bebas tracking-tighter">IMAGINE</span>
                </div>
             </div>

             {/* ======================= */}
             {/*       VERSO (10x15)     */}
             {/* ======================= */}
             <div className="w-[1080px] h-[1620px] bg-[#333] relative font-bebas flex flex-col overflow-hidden text-white">
                {/* Linha Lateral Verde */}
                <div className="absolute top-0 right-0 w-[40px] h-full bg-[#00FF55]"></div>
                
                {/* CABEÇALHO */}
                <div className="flex flex-col items-center pt-24 z-10 w-full px-20">
                   <h2 className="text-[160px] leading-[0.8] tracking-widest text-[#00FF55] text-center w-full">
                     CUIDADOS<br/><span className="text-white">COM A PEÇA</span>
                   </h2>
                   <div className="w-full h-[3px] bg-[#555] mt-12"></div>
                </div>

                {/* CORPO VERSO (Regras) */}
                <div className="flex-1 flex flex-col items-start justify-center px-24 gap-16 font-sans">
                   
                   {/* Regra 1 */}
                   <div className="flex items-center gap-10">
                      <div className="w-[180px] h-[180px] flex-shrink-0 bg-[#444] rounded-full flex items-center justify-center border-[4px] border-[#00FF55]">
                         <span className="text-[100px]">☀️</span>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[55px] font-bold text-white leading-none mb-2">EVITE O CALOR</h3>
                         <p className="text-[32px] text-gray-400 font-light leading-snug">
                           Não deixe a peça exposta diretamente à luz do sol por longos períodos ou em locais muito quentes para evitar empenamentos.
                         </p>
                      </div>
                   </div>

                   {/* Regra 2 */}
                   <div className="flex items-center gap-10">
                      <div className="w-[180px] h-[180px] flex-shrink-0 bg-[#444] rounded-full flex items-center justify-center border-[4px] border-[#00FF55]">
                         <span className="text-[100px]">💧</span>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[55px] font-bold text-white leading-none mb-2">CUIDADO COM A UMIDADE</h3>
                         <p className="text-[32px] text-gray-400 font-light leading-snug">
                           Apesar de resistente, peças pintadas à mão e envernizadas podem sofrer danos se lavadas de forma agressiva ou emersas em água.
                         </p>
                      </div>
                   </div>

                   {/* Regra 3 */}
                   <div className="flex items-center gap-10">
                      <div className="w-[180px] h-[180px] flex-shrink-0 bg-[#444] rounded-full flex items-center justify-center border-[4px] border-[#00FF55]">
                         <span className="text-[100px]">🧹</span>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[55px] font-bold text-white leading-none mb-2">LIMPEZA DELICADA</h3>
                         <p className="text-[32px] text-gray-400 font-light leading-snug">
                           Utilize apenas um pano seco ou um pincel de cerdas macias para remover a poeira. Não utilize produtos químicos abrasivos.
                         </p>
                      </div>
                   </div>

                </div>

                <div className="w-full text-center pb-10 text-[35px] text-gray-500 font-sans tracking-widest">
                  Feito com tecnologia e arte.
                </div>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default PrintCard;
