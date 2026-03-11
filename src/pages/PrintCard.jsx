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
      const imgData = await htmlToImage.toPng(node, { pixelRatio: 3, backgroundColor: '#111111' });
      
      // PDF no formato Exato (150mm L x 100mm A - Cada Face. O PDF contínuo terá 150mm x 200mm p/ abrigar as 2 telas)
      const pdf = new jsPDF('p', 'mm', [150, 200]); 
      pdf.addImage(imgData, 'PNG', 0, 0, 150, 200);
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Cartão de Agradecimento Deitado (15x10cm)</h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-sm text-yellow-800 rounded">
           <div className="flex items-start gap-2">
              <Info size={20} className="mt-0.5 flex-shrink-0" />
              <p>O cartão será gerado na proporção larga de cartão de visita: <strong>15x10cm</strong> na horizontal (Paisagem). A "Frente" contém informações e o cupom de recompra, e o "Verso" contém os Cuidados 3D.</p>
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
        <h3 className="text-gray-500 mb-6 font-medium">Pré-Visualização (Escala 35%)</h3>
        
        {/* Container Escalado do Cartão */}
        <div className="relative shadow-2xl flex-shrink-0 origin-top transform scale-[0.25] sm:scale-[0.35] md:scale-[0.4] transition-transform">
           
           <div ref={printRef} className="flex flex-col gap-0 border-[1px] border-dashed border-gray-400 bg-black">
             
             {/* ======================= */}
             {/*   FRENTE PAISAGEM (15x10)  */}
             {/* ======================= */}
             <div className="w-[1620px] h-[1080px] bg-[#111] relative font-bebas flex flex-row overflow-hidden border-b-2 border-gray-600">
                
                {/* Efeitos de Fundo */}
                <div className="absolute inset-0 opacity-[0.05]" style={{
                  backgroundImage: 'linear-gradient(#00FF55 2px, transparent 2px), linear-gradient(90deg, #00FF55 2px, transparent 2px)',
                  backgroundSize: '150px 150px'
                }}></div>
                <div className="absolute top-[-200px] left-[-200px] w-[800px] h-[800px] bg-[#00FF55] opacity-20 blur-[300px] rounded-full"></div>

                {/* AREA ESQUERDA - TEXTO PRINCIPAL */}
                <div className="flex-1 flex flex-col justify-center px-24 relative z-10 border-r-2 border-[#333]">
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-[16px] h-[16px] bg-[#00FF55] shadow-[0_0_20px_#00FF55]"></div>
                      <span className="text-[#00FF55] tracking-[0.3em] text-[40px] mt-2">IMAGINE</span>
                   </div>
                   
                   <h1 className="text-[120px] leading-[0.85] tracking-tight text-[#EBEBEB] text-left w-full mb-8">
                     SUA IMAGINAÇÃO<br/>TOMOU FORMA!
                   </h1>
                   <div className="w-[100px] h-[4px] bg-[#00FF55] mb-8 shadow-[0_0_15px_#00FF55]"></div>
                   
                   <p className="font-sans text-[36px] text-gray-300 text-left font-light leading-snug tracking-wide max-w-[650px] mb-12">
                      MUITO OBRIGADO POR CONFIAR NO NOSSO TRABALHO. SUA PEÇA FOI FEITA COM MUITO CUIDADO E DEDICAÇÃO!
                   </p>

                   {/* REDES SOCIAIS ABAIXO */}
                   <div className="flex items-center gap-6 text-white text-[40px] font-sans font-light mt-auto mb-10">
                      <QrCode size={70} color="#00FF55" />
                      <div className="flex flex-col leading-tight mt-2">
                         <span className="text-gray-400 text-[26px]">MARQUE A GENTE!</span>
                         <span className="font-bold text-[#EBEBEB] text-[42px] tracking-wider">{instagram}</span>
                      </div>
                   </div>
                </div>

                {/* AREA DIREITA - CUPOM */}
                <div className="w-[600px] flex flex-col items-center justify-center p-10 relative z-10">
                    <div className="w-[450px] border-2 border-[#00FF55] bg-black/60 p-10 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(0,255,85,0.15)] backdrop-blur-md">
                       
                       <div className="absolute -top-[30px] bg-[#00FF55] text-[#111] px-8 py-2 text-[35px] tracking-widest font-bold">
                          PRESENTE EXCLUSIVO
                       </div>
                       
                       <p className="font-sans text-[26px] text-gray-300 mb-6 mt-4 text-center px-4 leading-snug">
                         {discountText}
                       </p>
                       <div className="bg-[#00FF55]/10 w-full py-6 text-center border-[2px] border-[#00FF55] border-dashed">
                          <span className="text-[85px] tracking-wider text-[#00FF55] leading-none font-sans font-black shadow-sm">
                            {discountCode}
                          </span>
                       </div>
                       <p className="font-sans text-[16px] text-gray-400 mt-6 text-center italic font-light">
                         * Válido em compras via WhatsApp/Direct
                       </p>
                    </div>
                </div>
             </div>

             {/* ======================= */}
             {/*    VERSO PAISAGEM (15x10)     */}
             {/* ======================= */}
             <div className="w-[1620px] h-[1080px] bg-[#0F0F0F] relative font-bebas flex flex-row overflow-hidden text-white border-t-[4px] border-[#00FF55] border-dashed">
                
                {/* Linha Inferior Verde */}
                <div className="absolute bottom-0 right-0 w-full h-[15px] bg-[#00FF55] opacity-20 z-0"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00FF55] opacity-[0.05] blur-[150px] rounded-full z-0"></div>

                {/* AREA ESQUERDA - TÍTULO CUIDADOS */}
                <div className="w-[450px] flex flex-col items-center justify-center px-16 bg-[#111]/50 border-r border-[#333] z-10">
                   <h2 className="text-[150px] leading-[0.8] tracking-widest text-white text-left w-full">
                     CUIDADOS<br/><span className="text-[#00FF55]">COM A PEÇA</span>
                   </h2>
                   <div className="w-[100px] h-[4px] bg-[#00FF55] mt-8 mb-6 shadow-[0_0_15px_#00FF55] self-start"></div>
                   <span className="text-[28px] text-[#00FF55] font-sans tracking-[0.2em] font-light self-start mt-20">IMAGINE STUDIO</span>
                </div>

                {/* AREA DIREITA - CORPO REGRAS */}
                <div className="flex-1 flex flex-col items-start justify-center px-24 gap-12 font-sans relative z-10">
                   
                   {/* Regra 1 */}
                   <div className="flex items-center gap-10">
                      <div className="w-[130px] h-[130px] flex-shrink-0 bg-[#111] rounded-[20px] flex items-center justify-center border-[2px] border-[#00FF55] shadow-[0_0_30px_rgba(0,255,85,0.2)]">
                         <span className="text-[65px] grayscale brightness-200 sepia-[1] hue-rotate-[70deg] saturate-[5] opacity-80">☀️</span>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[45px] font-bold text-white leading-none mb-1 tracking-wide">EVITE O CALOR</h3>
                         <p className="text-[28px] text-gray-400 font-light leading-snug w-full max-w-[800px]">
                           Não deixe a peça exposta testando à luz do sol ou em locais abafados para evitar empenamentos na resina.
                         </p>
                      </div>
                   </div>

                   {/* Regra 2 */}
                   <div className="flex items-center gap-10">
                      <div className="w-[130px] h-[130px] flex-shrink-0 bg-[#111] rounded-[20px] flex items-center justify-center border-[2px] border-[#00FF55] shadow-[0_0_30px_rgba(0,255,85,0.2)]">
                         <span className="text-[65px] grayscale brightness-200 sepia-[1] hue-rotate-[70deg] saturate-[5] opacity-80">💧</span>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[45px] font-bold text-white leading-none mb-1 tracking-wide">ÁGUA E UMIDADE</h3>
                         <p className="text-[28px] text-gray-400 font-light leading-snug w-full max-w-[800px]">
                           Modelos não devem ser mergulhados na água ou lavados com produtos químicos sob risco de danificar a pintura.
                         </p>
                      </div>
                   </div>

                   {/* Regra 3 */}
                   <div className="flex items-center gap-10">
                      <div className="w-[130px] h-[130px] flex-shrink-0 bg-[#111] rounded-[20px] flex items-center justify-center border-[2px] border-[#00FF55] shadow-[0_0_30px_rgba(0,255,85,0.2)]">
                         <span className="text-[65px] grayscale brightness-200 sepia-[1] hue-rotate-[70deg] saturate-[5] opacity-80">🧹</span>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[45px] font-bold text-white leading-none mb-1 tracking-wide">LIMPEZA DELICADA</h3>
                         <p className="text-[28px] text-gray-400 font-light leading-snug w-full max-w-[800px]">
                           Utilize apenas um pano seco de microfibra ou um pincel de cerdas bem macias para espanar o pó da peça.
                         </p>
                      </div>
                   </div>

                </div>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default PrintCard;
