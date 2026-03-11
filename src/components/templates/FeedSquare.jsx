import React from 'react';
import { forwardRef } from 'react';

// Feed Quadrado 1:1 (1080 x 1080) - Focado apenas em TEXTO
const FeedSquare = forwardRef(({ modelName, themeName, sizes, painting, material, creatorName, postTitle, postText }, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-[#111111] relative shadow-2xl overflow-hidden font-bebas flex flex-col justify-center items-center"
      style={{ 
        width: '1080px', 
        height: '1080px',
      }}
    >
      {/* Detalhes de Background (Grid ou linhas) para ficar Tech/3D */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(#00FF55 1px, transparent 1px), linear-gradient(90deg, #00FF55 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}></div>

      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00FF55] opacity-20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00FF55] opacity-10 blur-[100px] rounded-full"></div>

      {/* HEADER SIMPLES */}
      <div className="absolute top-16 left-16 z-20 flex items-center gap-4">
        <div className="w-[12px] h-[12px] bg-[#00FF55]"></div>
        <span className="text-[#00FF55] tracking-[0.3em] text-[24px]">IMAGINE</span>
      </div>

      {/* ÁREA CENTRAL - MENSAGEM */}
      <div className="flex flex-col items-center justify-center z-20 px-24 w-full">
         
         <h2 className="text-[110px] leading-[0.9] text-[#00FF55] text-center w-full break-words uppercase">
           {postTitle || 'PREENCHA O TÍTULO DO POST'}
         </h2>
         
         <div className="w-[150px] h-[4px] bg-white my-12"></div>
         
         <p className="text-[45px] leading-snug text-[#EBEBEB] text-center font-sans font-light tracking-wide w-full max-w-[900px]">
           {postText || 'Preencha a descrição que ficará em destaque no meio da arte.'}
         </p>

      </div>

      {/* FOOTER */}
      <div className="absolute bottom-16 left-0 w-full px-16 z-20 flex justify-between items-end">
         <div className="flex flex-col">
            <span className="text-gray-500 tracking-widest text-[22px]">SAIBA MAIS EM</span>
            <span className="text-white text-[35px] font-sans font-bold">@IMAGINE.HUB_</span>
         </div>
      </div>
    </div>
  );
});

export default FeedSquare;
