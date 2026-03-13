import React from 'react';
import { forwardRef } from 'react';

// Feed Vertical 4:5 (1080 x 1350)
const FeedPortrait = forwardRef(({ modelName, themeName, sizes, painting, material, creatorName, imageSrc, isTextOnly, postTitle, postText }, ref) => {
  return (
    <div 
      ref={ref} 
      className={`relative shadow-2xl overflow-hidden font-bebas flex flex-col ${isTextOnly ? 'bg-[#111]' : 'bg-[#EBEBEB]'}`}
      style={{ 
        width: '1080px', 
        height: '1350px',
      }}
    >
      {isTextOnly ? (
        // --- DESIGN APENAS TEXTO (ESCURO/NEON) ---
        <>
          {/* Fundo Tech */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#00FF55] opacity-10 blur-[200px] rounded-full"></div>

          {/* HEADER */}
          <div className="absolute top-16 left-16 z-20 flex items-center gap-4">
            <div className="w-[12px] h-[12px] bg-[#00FF55]"></div>
            <span className="text-[#00FF55] tracking-[0.3em] text-[24px]">IMAGINE</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center z-20 px-24 w-full mt-10">
             <h2 className="text-[130px] leading-[0.9] text-[#00FF55] text-center w-full break-words uppercase">
               {postTitle || 'TÍTULO DA ARTE AQUI'}
             </h2>
             <div className="w-[200px] h-[4px] bg-white my-16"></div>
             <p className="text-[48px] leading-[1.3] text-[#EBEBEB] text-center font-sans font-light tracking-wide w-full max-w-[900px]">
               {postText || 'Adicione um texto descritivo mais longo e limpo que seja facilmente lido pelos seus clientes.'}
             </p>
          </div>

          {/* FOOTER */}
          <div className="absolute bottom-16 left-0 w-full px-16 z-20 flex justify-between items-end">
             <div className="flex flex-col">
                <span className="text-gray-500 tracking-widest text-[22px]">CONFIRA NO INSTAGRAM</span>
                <span className="text-white text-[35px] font-sans font-bold">@IMAGINE.HUB_</span>
             </div>
          </div>
        </>
      ) : (
        // --- DESIGN COM PRODUTO (CLARO/MINIMALISTA) ---
        <>
          {/* HEADER SIMPLES */}
          <div className="w-full flex items-center px-16 pt-16 z-20">
             <div className="w-[12px] h-[12px] bg-[#00FF55] mr-4"></div>
             <span className="text-[#333] tracking-[0.3em] text-[24px]">NOVO LANÇAMENTO</span>
             <div className="flex-1 h-[2px] bg-[#ccc] ml-6"></div>
          </div>

          <div className="flex-1 flex flex-col items-center w-full z-20 mt-16">
              {/* Títulos centralizados com fonte ajustada */}
              <h2 className="text-[110px] leading-[0.9] text-[#333] text-center w-full px-10 break-words mb-4 uppercase">
                {modelName}
              </h2>
              
              {themeName && (
                <div className="rounded-full bg-[#333] px-8 py-2 mb-10">
                   <h3 className="text-[45px] leading-none text-[#00FF55] uppercase tracking-wider text-center">
                       {themeName}
                   </h3>
                </div>
              )}
              
              <div className="w-[850px] h-[600px] relative z-20 border-4 border-[#00FF55] shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-white p-4">
                {imageSrc ? (
                    <img src={imageSrc} alt="Produto" className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full bg-[#f1f1f1] flex items-center justify-center text-5xl text-gray-400 font-sans tracking-wide text-center px-10">
                        IMAGEM CENTRAL (850x600)
                    </div>
                )}
              </div>
          </div>

          {/* FOOTER VERDE NEON - INFORMAÇÕES TÉCNICAS (Refinado) */}
          <div className="bg-[#00FF55] w-full h-[220px] flex items-center justify-between px-12 relative z-30 absolute bottom-0 shadow-[0_-10px_40px_rgba(0,255,85,0.4)]">
             <div className="flex gap-12 h-full py-8">
                <div className="flex flex-col justify-between">
                   <div>
                      <p className="text-[#111] font-sans text-[18px] font-bold tracking-widest mb-0 opacity-80">TAMANHO</p>
                      <p className="text-[#111] text-[40px] leading-none">{sizes}</p>
                   </div>
                   <div>
                      <p className="text-[#111] font-sans text-[18px] font-bold tracking-widest mb-0 opacity-80">PINTURA</p>
                      <p className="text-[#111] text-[40px] leading-none">{painting}</p>
                   </div>
                </div>
                <div className="flex flex-col justify-between">
                   <div>
                      <p className="text-[#111] font-sans text-[18px] font-bold tracking-widest mb-0 opacity-80">MATERIAL</p>
                      <p className="text-[#111] text-[40px] leading-none">{material}</p>
                   </div>
                   <div>
                      <p className="text-[#111] font-sans text-[18px] font-bold tracking-widest mb-0 opacity-80">CRIADOR</p>
                      <p className="text-[#111] text-[40px] leading-none">{creatorName}</p>
                   </div>
                </div>
             </div>

             <div className="w-[2px] h-[120px] bg-[#111]/20 mx-4"></div>

             {/* Chamada Final */}
             <div className="flex flex-col items-center justify-center flex-1 pr-4">
                <h4 className="text-[#111] text-[60px] leading-[0.9] text-center mb-3">
                  FAÇA SUA ENCOMENDA
                </h4>
                <p className="text-[#111] text-[20px] leading-tight text-center tracking-wide font-sans font-medium w-full max-w-[400px]">
                  Mais informações via DIRECT ou WhatsApp. Estamos online!
                </p>
             </div>
          </div>
        </>
      )}
    </div>
  );
});

export default FeedPortrait;
