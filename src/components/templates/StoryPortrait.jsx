import React from 'react';
import { forwardRef } from 'react';

// Story Vertical 9:16 (1080 x 1920)
const StoryPortrait = forwardRef(({ modelName, themeName, sizes, painting, material, creatorName, imageSrc, isTextOnly, postTitle, postText }, ref) => {
  return (
    <div 
      ref={ref} 
      className={`relative shadow-2xl overflow-hidden font-bebas flex ${isTextOnly ? 'bg-[#111] flex-col' : 'bg-[#EBEBEB]'}`}
      style={{ 
        width: '1080px', 
        height: '1920px',
      }}
    >
       {isTextOnly ? (
        // --- DESIGN APENAS TEXTO (ESCURO/NEON) ---
        <>
          {/* Fundo Tech Vertical */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'linear-gradient(#00FF55 2px, transparent 2px), linear-gradient(90deg, #00FF55 2px, transparent 2px)',
            backgroundSize: '150px 150px'
          }}></div>
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00FF55] opacity-20 blur-[250px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00FF55] opacity-10 blur-[150px] rounded-full"></div>

          {/* HEADER SIMPLES */}
          <div className="w-full flex justify-between items-center px-16 pt-24 z-20">
            <span className="text-[#00FF55] tracking-[0.3em] text-[35px]">IMAGINE</span>
            <div className="w-[12px] h-[12px] bg-[#00FF55] shadow-[0_0_15px_#00FF55]"></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center z-20 px-20 w-full mt-10">
             <div className="border-l-[10px] border-[#00FF55] pl-10 mb-16 self-start ml-4">
               <h2 className="text-[140px] leading-[0.85] text-[#00FF55] text-left w-full break-words uppercase">
                 {postTitle || 'SEU TÍTULO AQUI'}
               </h2>
             </div>
             <p className="text-[55px] leading-[1.3] text-[#EBEBEB] text-left font-sans font-light tracking-wide w-full max-w-[850px] pl-14 self-start">
               {postText || 'Este é um espaço dedicado para contar novidades, passar avisos importantes ou detalhar algo de forma limpa e visível no Story.'}
             </p>
          </div>

          {/* FOOTER */}
          <div className="w-full pb-20 pt-10 px-20 z-20 flex justify-center items-end border-t border-[#333] mx-auto max-w-[900px]">
             <span className="text-gray-500 tracking-widest text-[30px] font-sans uppercase">A ARTE DA IMPRESSÃO 3D</span>
          </div>
        </>
      ) : (
        // --- DESIGN COM PRODUTO (BARRA LATERAL) ---
        <>
          {/* BARRA LATERAL DIREITA VERDE NEON */}
          <div className="absolute top-0 right-0 w-[240px] h-full bg-[#00FF55] z-10 flex flex-col items-center pt-20 pb-16 shadow-[-15px_0_40px_rgba(0,0,0,0.15)]">
             
             {/* Textos Identidade ao invés de Fake Logo enorme */}
             <div className="transform -rotate-90 mt-40 w-full flex justify-center">
                <span className="text-[#111] text-[80px] tracking-tighter opacity-20">PREMIUM 3D</span>
             </div>

             <div className="flex-1"></div>
             
             {/* Informações na Lateral */}
             <div className="flex flex-col gap-12 w-full px-4 pb-6 relative translate-y-[-100px]">
                
                <div className="flex flex-col items-center text-center">
                   <p className="text-[#111] font-sans font-bold text-[18px] tracking-widest mb-1 opacity-80">TAMANHO</p>
                   <p className="text-[#111] text-[40px] leading-none">{sizes}</p>
                </div>
                <div className="w-[60%] h-[2px] bg-[#111]/20 mx-auto"></div>

                <div className="flex flex-col items-center text-center">
                   <p className="text-[#111] font-sans font-bold text-[18px] tracking-widest mb-1 opacity-80">PINTURA</p>
                   <p className="text-[#111] text-[40px] leading-none">{painting}</p>
                </div>
                <div className="w-[60%] h-[2px] bg-[#111]/20 mx-auto"></div>

                <div className="flex flex-col items-center text-center">
                   <p className="text-[#111] font-sans font-bold text-[18px] tracking-widest mb-1 opacity-80">MATERIAL</p>
                   <p className="text-[#111] text-[40px] leading-none">{material}</p>
                </div>
                <div className="w-[60%] h-[2px] bg-[#111]/20 mx-auto"></div>

                <div className="flex flex-col items-center text-center">
                   <p className="text-[#111] font-sans font-bold text-[18px] tracking-widest mb-1 opacity-80">CRIADOR</p>
                   <p className="text-[#111] text-[40px] leading-none">{creatorName}</p>
                </div>

             </div>
          </div>

          {/* ÁREA PRINCIPAL ESQUERDA (840px) */}
          <div className="flex-1 w-[840px] flex flex-col pr-[240px] h-full relative z-20">
             
             {/* HEADER ESQUERDO */}
             <div className="w-full flex flex-col items-start pt-24 pl-16">
                <h2 className="text-[40px] text-[#00FF55] bg-[#333] px-6 py-2 uppercase font-medium tracking-wider mb-6">
                  {themeName}
                </h2>
                <h1 className="text-[120px] leading-[0.85] tracking-tight text-[#333] uppercase max-w-[700px] break-words">
                  {modelName}
                </h1>
             </div>

             {/* ÁREA CENTRAL - Produto Gigante */}
             <div className="flex-1 flex justify-center items-center w-full pl-8 relative">
                 <div className="w-[650px] h-[900px] relative z-10 flex items-center justify-center">
                    {imageSrc ? (
                        <img 
                          src={imageSrc} 
                          alt="Produto" 
                          className="max-w-[130%] max-h-[130%] object-contain drop-shadow-2xl" 
                          style={{ filter: 'drop-shadow(30px 30px 50px rgba(0,0,0,0.4))' }}
                        />
                    ) : (
                        <div className="w-[500px] h-[500px] bg-[#ddd] flex flex-col items-center justify-center text-4xl text-gray-500 font-sans tracking-wide text-center px-10 rounded-full border-[6px] border-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                           IMAGEM CENTRAL PNG
                        </div>
                    )}
                 </div>
             </div>

             {/* FOOTER ESQUERDO */}
             <div className="w-full pb-20 pl-16 pr-8 flex flex-col items-start">
                <div className="w-[100px] h-[6px] bg-[#00FF55] mb-8"></div>
                <h4 className="text-[#333] text-[55px] leading-[0.9] text-left mb-4 uppercase">
                  Faça sua Encomenda<br/>Via Direct
                </h4>
                <p className="text-[#555] text-[28px] leading-snug text-left font-sans font-medium w-full max-w-[600px]">
                  Qualidade impressionante e atenção em cada detalhe. Solicite seu orçamento!
                </p>
             </div>
          </div>
        </>
      )}
    </div>
  );
});

export default StoryPortrait;
