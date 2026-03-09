import React, { useState, useRef } from 'react';
import { Camera, Trash2, Download } from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image';
import FeedSquare from '../components/templates/FeedSquare';
import FeedPortrait from '../components/templates/FeedPortrait';
import StoryPortrait from '../components/templates/StoryPortrait';

const SocialMedia = () => {
  const [modelName, setModelName] = useState('NOME DO MODELO');
  const [themeName, setThemeName] = useState('TEMA / COLEÇÃO');
  const [creatorName, setCreatorName] = useState('CRIADOR');
  const [material, setMaterial] = useState('RESINA');
  const [painting, setPainting] = useState('PADRÃO');
  const [sizes, setSizes] = useState('15A 10L 8C');
  const [imageSrc, setImageSrc] = useState(null);
  const [postTitle, setPostTitle] = useState('NOVIDADE NA LOJA');
  const [postText, setPostText] = useState('Confira os detalhes dessa peça incrível, feita com extrema qualidade.');
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef(null);

  const [activeTab, setActiveTab] = useState('Feed 4:5 Produto'); // Feed 1:1, Feed 4:5, Story 9:16
  const tabs = ['Feed 1:1 Texto', 'Feed 1:1 Mist', 'Feed 4:5 Texto', 'Feed 4:5 Produto', 'Story 9:16 Texto', 'Story 9:16 Produto'];

  const handleExport = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    
    try {
      await document.fonts.ready;
      
      const node = printRef.current;
      const fileName = `Imagine_${activeTab.replace(/ /g, '_')}_${modelName}`;

      const imgData = await htmlToImage.toPng(node, { pixelRatio: 2, backgroundColor: '#EBEBEB' });
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Erro ao exportar a arte:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (x) => setImageSrc(x.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 font-sans text-gray-800 flex flex-col xl:flex-row gap-8 min-h-screen">
      
      {/* PAINEL CONTROLE LATERAL */}
      <div className="w-full xl:w-1/3 bg-white p-6 rounded-xl shadow-lg h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Gerador de Posts</h2>

        {/* Upload de Imagem */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto (Transparente)</label>
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

        {/* Textos Principais */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {activeTab.includes('Texto') && (
            <>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Título do Post</label>
                <input 
                  value={postTitle} 
                  onChange={(e) => setPostTitle(e.target.value)} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none uppercase" 
                />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-gray-500">Texto Secundário / Descrição</label>
                <textarea 
                  value={postText} 
                  onChange={(e) => setPostText(e.target.value)} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none resize-none h-20" 
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
             <div className="flex-1">
                <label className="text-xs uppercase font-bold text-gray-500">Nome do Modelo (HIEI DRAGON-V2)</label>
                <input 
                  value={modelName} 
                  onChange={(e) => setModelName(e.target.value)} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none uppercase" 
                />
             </div>
             <div className="flex-1">
                <label className="text-xs uppercase font-bold text-gray-500">Tema/Coleção (YU YU HAKUSHO)</label>
                <input 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none uppercase" 
                />
             </div>
          </div>
        </div>

        {/* Especificações */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Tamanhos (15A 10L 8C)</label>
            <input 
              value={sizes} 
              onChange={(e) => setSizes(e.target.value)} 
              className="w-full p-2 border rounded outline-none uppercase" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Pintura</label>
            <input 
              value={painting} 
              onChange={(e) => setPainting(e.target.value)} 
              className="w-full p-2 border rounded outline-none uppercase" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Material</label>
            <input 
              value={material} 
              onChange={(e) => setMaterial(e.target.value)} 
              className="w-full p-2 border rounded outline-none uppercase" 
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Criador da Modelagem</label>
            <input 
              value={creatorName} 
              onChange={(e) => setCreatorName(e.target.value)} 
              className="w-full p-2 border rounded outline-none uppercase" 
            />
          </div>
        </div>

        {/* Ações */}
        <div className="mt-4 border-t pt-4">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
          >
            <Download size={20} /> {isExporting ? 'Processando...' : 'Baixar Arte Mostrada (PNG)'}
          </button>
        </div>
      </div>

      {/* ÁREA DE PRÉ-VISUALIZAÇÃO */}
      <div className="flex-1 flex flex-col bg-gray-200/50 p-4 rounded-xl items-center pb-20 overflow-x-auto relative">
        
        {/* Switcher de Abas */}
        <div className="flex bg-white p-1 rounded-lg shadow-sm mb-8 max-w-full overflow-x-auto">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 whitespace-nowrap rounded-md font-medium text-xs transition-colors ${
                activeTab === tab ? 'bg-[#00FF55] text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Container Renderizado Oculto ou visível da Arte */}
        <div className="relative shadow-2xl flex-shrink-0 origin-top transform scale-[0.25] sm:scale-[0.35] md:scale-[0.4] lg:scale-[0.45] xl:scale-[0.5] transition-transform">
           {activeTab.includes('Feed 1:1') && (
             <FeedSquare 
               ref={printRef}
               modelName={modelName}
               themeName={themeName}
               sizes={sizes}
               painting={painting}
               material={material}
               creatorName={creatorName}
               imageSrc={activeTab.includes('Mist') ? imageSrc : null} 
               isTextOnly={activeTab.includes('Texto')}
               postTitle={postTitle}
               postText={postText}
             />
           )}
           {activeTab.includes('Feed 4:5') && (
             <FeedPortrait 
               ref={printRef}
               modelName={modelName}
               themeName={themeName}
               sizes={sizes}
               painting={painting}
               material={material}
               creatorName={creatorName}
               imageSrc={imageSrc} 
               isTextOnly={activeTab.includes('Texto')}
               postTitle={postTitle}
               postText={postText}
             />
           )}
           {activeTab.includes('Story 9:16') && (
             <StoryPortrait 
               ref={printRef}
               modelName={modelName}
               themeName={themeName}
               sizes={sizes}
               painting={painting}
               material={material}
               creatorName={creatorName}
               imageSrc={imageSrc}
               isTextOnly={activeTab.includes('Texto')}
               postTitle={postTitle}
               postText={postText}
             />
           )}
        </div>

      </div>
    </div>
  );
};

export default SocialMedia;
