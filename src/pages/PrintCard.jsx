import React, { useState, useRef, useEffect } from 'react';
import { Download, Info, QrCode, SunMedium, Droplets, Brush, ShieldAlert, ThermometerSun, AlertTriangle, CornerDownRight, RefreshCw } from 'lucide-react';
import * as htmlToImage from 'https://esm.sh/html-to-image';
import { jsPDF } from 'https://esm.sh/jspdf';
import ReactQRCode from 'react-qr-code';

// Regras de Cuidado baseadas no Material escolhido
const CARE_RULES = {
  'Resina': [
    { icon: SunMedium, title: "EVITE LUZ SOLAR DIRETA", text: "A luz UV solar pode ressecar a resina aos poucos, causando rachaduras graves ou empenamentos na sua peça.", color: "#FFaa00" },
    { icon: Droplets, title: "ÁGUA E UMIDADE", text: "Modelos com pintura artesanal não devem ser lavados com produtos químicos sob risco de danificar a cor e as sombras.", color: "#00aaff" },
    { icon: Brush, title: "LIMPEZA DELICADA", text: "Utilize apenas um pano seco de microfibra ou um pincel de cerdas bem macias para espanar o pó da estatueta.", color: "#00FF55" },
    { icon: AlertTriangle, title: "ALTA FRAGILIDADE", text: "Peças em resina impressas com alto detalhe são como vidro. Evite pancadas ou pressões fortes nas extremidades.", color: "#FF3366" }
  ],
  'PLA': [
    { icon: ThermometerSun, title: "O PIOR INIMIGO: CALOR", text: "O PLA amolece em temperaturas acima de 50°C. Nunca deixe no painel do carro sob o sol ou próximo a fontes de calor intenso.", color: "#FF5500" },
    { icon: Droplets, title: "ÁGUA E UMIDADE", text: "Peças pintadas à mão não devem ser mergulhadas ou banhadas com produtos químicos sob risco de corrosão do verniz.", color: "#00aaff" },
    { icon: Brush, title: "LIMPEZA DELICADA", text: "Utilize apenas um pano seco de algodão ou um pincel de cerdas longas para espanar o pó concentrado nas ranhuras.", color: "#00FF55" },
    { icon: ShieldAlert, title: "RESISTÊNCIA FÍSICA", text: "O Plástico PLA é resistente a esbarrões leves, porém braços, espadas e partes pontiagudas podem quebrar se tensionadas.", color: "#aa00ff" }
  ],
  'PLA ULTRA / SILK': [
    { icon: ThermometerSun, title: "EVITE O CALOR", text: "Apesar de ter aditivos plásticos, o PLA Silk deformará em temperaturas elevadas, evite exposição solar persistente.", color: "#FF5500" },
    { icon: Droplets, title: "PRESERVE O BRILHO", text: "Caso tenha acabamento nativo metálico (Silk), jamais jogue água ou limpa vidros, ele irá perder o brilho metálico acetinado.", color: "#00aaff" },
    { icon: Brush, title: "LIMPEZA DELICADA", text: "Para não oxidar o bilho especial da peça, utilize apenas um pano de microfibra a seco para polir o objeto.", color: "#00FF55" },
    { icon: ShieldAlert, title: "MUITO CUIDADO", text: "O filamento de cor Silk/Ultra possui as camadas mais fracas do mercado, sendo extremamente fácil de quebrar se cair no chão.", color: "#FF3366" }
  ],
  'PETG / ABS': [
    { icon: ThermometerSun, title: "RESISTÊNCIA TÉRMICA", text: "Seu material suporta temperaturas elevadas e intempéries (sol direto e chuva contínua). Ótimo para partes mecânicas externas.", color: "#FF5500" },
    { icon: Droplets, title: "ÁGUA E UMIDADE", text: "Mesmo sendo um material duro, caso a peça possua pintura acrílica manual em cima, evite lavagens agressivas ou esfregões.", color: "#00aaff" },
    { icon: Brush, title: "LIMPEZA DIÁRIA", text: "Você pode manter a peça higienizada tranquilamente no dia a dia com uma flanela umedecida com água.", color: "#00FF55" },
    { icon: ShieldAlert, title: "ALTA DURABILIDADE", text: "Esta é uma peça técnica termoplástica. Possui excelente resistência a impactos mecânicos e uso severo.", color: "#aa00ff" }
  ]
};

const PrintCard = () => {
  const [materialType, setMaterialType] = useState('Resina');
  const [discountCode, setDiscountCode] = useState('5%OFF');
  const [discountText, setDiscountText] = useState('Ganhe 5% OFF em próximas compras!');

  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef(null);

  const [couponId, setCouponId] = useState('');
  const [validityDate, setValidityDate] = useState('');

  // Gera um Hash Curto (Ex: AB8X9)
  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  // Gera a data atual + 30 dias formatada (DD/MM/YYYY)
  const calculateValidity = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('pt-BR');
  };

  const regenerateID = () => {
    setCouponId(generateShortId());
  };

  useEffect(() => {
    regenerateID();
    setValidityDate(calculateValidity());
  }, []);

  const instagramURL = "https://www.instagram.com/imagine.hub_?igsh=MWl6dmwzZWJuMmJuZg==";

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);

    try {
      // 1. Salvar os dados do Cupom no LocalStorage do Navegador para controle futuro
      const newCouponRecord = {
        id: couponId,
        material: materialType,
        code: discountCode,
        createdAt: new Date().toISOString(),
        expiresAt: validityDate
      };

      const existingCoupons = JSON.parse(localStorage.getItem('imagineHub_coupons') || '[]');
      existingCoupons.push(newCouponRecord);
      localStorage.setItem('imagineHub_coupons', JSON.stringify(existingCoupons));

      await document.fonts.ready;

      const node = printRef.current;
      const fileName = `Cartao_Imagine_${materialType}_10x15cm`;

      // Gerar imagem em alta resolução
      const imgData = await htmlToImage.toPng(node, { pixelRatio: 3, backgroundColor: '#111111' });

      // PDF no formato Exato (150mm L x 100mm A - Cada Face)
      const pdf = new jsPDF('p', 'mm', [150, 200]);
      pdf.addImage(imgData, 'PNG', 0, 0, 150, 200);
      pdf.save(`${fileName}.pdf`);

    } catch (error) {
      console.error('Erro ao exportar o cartão:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const currentRules = CARE_RULES[materialType] || CARE_RULES['Resina'];

  return (
    <div className="p-4 font-sans text-gray-800 flex flex-col xl:flex-row gap-8 min-h-screen">

      {/* PAINEL DE CONTROLE LATERAL */}
      <div className="w-full xl:w-1/3 bg-white p-6 rounded-xl shadow-lg h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Cartão de Agradecimento Deitado (15x10cm)</h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-sm text-yellow-800 rounded">
          <div className="flex items-start gap-2">
            <Info size={20} className="mt-0.5 flex-shrink-0" />
            <p>Selecione o Material base da Impressão 3D para gerar alertas de Cuidado direcionados no Verso do cartão.</p>
          </div>
        </div>

        {/* Textos Principais */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500">Material da Impressão (Regras Dinâmicas)</label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none font-bold text-gray-700 bg-gray-50"
            >
              {Object.keys(CARE_RULES).map(mat => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>
          <div className="mt-2">
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

        {/* Gerenciamento de ID */}
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase">ID Atual do Cupom</span>
              <span className="font-mono text-lg font-bold text-[#FF1144]">#{couponId}</span>
            </div>
            <button 
              onClick={regenerateID}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded transition-colors text-sm"
            >
              <RefreshCw size={16} /> Gerar Novo
            </button>
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
            <div className="w-[1620px] h-[1080px] bg-[#111] relative font-bebas flex flex-row overflow-hidden">

              {/* Luz Neon Background Oculto */}
              <div className="absolute top-[-200px] left-[-200px] w-[800px] h-[800px] bg-[#00FF55] opacity-20 blur-[300px] rounded-full"></div>

              {/* AREA ESQUERDA - TEXTO PRINCIPAL */}
              <div className="flex-1 flex flex-col justify-center items-start px-24 relative z-10">

                {/* Logo Superior */}
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-[16px] h-[16px] bg-[#00FF55] shadow-[0_0_20px_#00FF55]"></div>
                  <span className="text-[#00FF55] tracking-[0.3em] text-[40px] mt-2">IMAGINE</span>
                </div>

                {/* Título Centralizado Verticalmente */}
                <h1 className="text-[120px] leading-[0.85] tracking-tight text-[#EBEBEB] text-left w-full mb-8">
                  SUA IMAGINAÇÃO<br />TOMOU FORMA!
                </h1>
                <div className="w-[100px] h-[4px] bg-[#00FF55] mb-8 shadow-[0_0_15px_#00FF55]"></div>

                <p className="font-sans text-[34px] text-gray-300 text-left font-light leading-snug tracking-wide max-w-[650px] mb-12">
                  MUITO OBRIGADO POR CONFIAR NO NOSSO TRABALHO. ESPERAMOS QUE AME SUA NOVA PEÇA!
                </p>

                {/* QR CODE E REDES SOCIAIS NA MESMA LINHA */}
                <div className="flex items-center gap-8 text-white text-[40px] font-sans font-light mt-auto mb-10">
                  {/* QR Code Real Gerado com a lib de Câmera */}
                  <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(0,255,85,0.4)] relative">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#00FF55] border-4 border-[#111] animate-pulse"></div>
                    <ReactQRCode value={instagramURL} size={150} level="H" fgColor="#111" />
                  </div>

                  <div className="flex flex-col leading-tight mt-2 ml-4">
                    <span className="text-gray-400 text-[26px]">NOS MARQUE EM:</span>
                    <span className="font-bold text-[#EBEBEB] text-[45px] tracking-wider mb-2">@IMAGINE.HUB_</span>

                    <div className="w-full h-[2px] bg-gray-600 my-2"></div>

                    <span className="text-gray-400 text-[22px] mt-2">DEIXE SEU FEEDBACK NO SITE</span>
                    <span className="font-bold text-[#00FF55] text-[28px] tracking-wider drop-shadow-lg">WWW.IMAGINEHUB.SITE</span>
                  </div>
                </div>

              </div>

              {/* AREA DIREITA - CUPOM */}
              <div className="w-[600px] flex flex-col items-center justify-center p-10 relative z-10">
                
                <div className="relative flex flex-col items-center">
                  {/* Etiqueta Superior Movida para Evitar Clipping de Canvas */}
                  <div className="absolute -top-[30px] bg-[#00FF55] text-[#111] px-8 py-2 text-[30px] tracking-widest font-bold z-30">
                    PRESENTE EXCLUSIVO
                  </div>

                  <div className="w-[450px] border-2 border-[#00FF55] bg-black/60 p-10 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,255,85,0.15)] backdrop-blur-md mb-8">

                    <p className="font-sans text-[26px] text-gray-300 mb-6 mt-4 text-center px-4 leading-snug">
                      {discountText}
                    </p>
                    <div className="bg-[#00FF55]/10 w-full py-6 text-center border-[2px] border-[#00FF55] border-dashed">
                      <span className="text-[85px] tracking-wider text-[#00FF55] leading-none font-sans font-black shadow-sm">
                        {discountCode}
                      </span>
                    </div>
                    <p className="font-sans text-[20px] text-gray-400 mt-6 mb-2 text-center italic font-light drop-shadow-md">
                      * Válido para compras via WhatsApp e Direct!
                    </p>
                  </div>

                  {/* Etiqueta de Segurança / Validade Moficicada para Evitar Clipping de Canvas */}
                  <div className="absolute -bottom-2 bg-[#FF1144] px-6 py-1.5 text-white font-sans text-[18px] font-bold tracking-widest rounded shadow-xl flex items-center gap-3 z-30">
                    <span>VALIDADE: {validityDate}</span>
                    <span className="text-white/40">|</span>
                    <span>ID: #{couponId}</span>
                  </div>
                </div>

              </div>

              {/* AVISO VIRAR O CARTÃO */}
              <div className="absolute bottom-6 right-8 z-30 flex items-center gap-3 text-white/50">
                <span className="font-sans font-medium text-[20px] tracking-wide">VIRE PARA CUIDADOS ESPECIAIS</span>
                <CornerDownRight size={28} />
              </div>

            </div>

            {/* ======================= */}
            {/*    VERSO PAISAGEM (15x10)     */}
            {/* ======================= */}
            <div className="w-[1620px] h-[1080px] bg-[#0F0F0F] relative font-bebas flex flex-col overflow-hidden text-white border-t-[4px] border-[#00FF55] border-dashed">

              {/* Linha Inferior Verde */}
              <div className="absolute bottom-0 right-0 w-full h-[15px] bg-[#00FF55] opacity-20 z-0"></div>
              <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00FF55] opacity-[0.05] blur-[150px] rounded-full z-0"></div>

              {/* AREA SUPERIOR - TÍTULO CUIDADOS (HEADER TOP) */}
              <div className="w-full h-[350px] flex flex-col items-center justify-center bg-[#111] border-b-2 border-[#333] z-10 relative">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,85,0.05)_0%,transparent_100%)]"></div>
                <h2 className="text-[90px] leading-[0.8] tracking-[0.1em] text-[#EBEBEB] text-center w-full mt-10">
                  CUIDADOS <span className="text-[#00FF55]">COM SUA PEÇA</span>
                </h2>

                <div className="flex items-center gap-8 mt-10">
                  <p className="font-sans text-gray-400 text-[26px] leading-snug font-light bg-[#111] border border-[#333] px-6 py-2 rounded-full">
                    MATERIAL BASE DE PRODUÇÃO: <strong className="text-[#00FF55] tracking-widest font-bold ml-2">{materialType}</strong>
                  </p>
                  <div className="w-[4px] h-[40px] bg-[#333]"></div>
                  <span className="text-[28px] text-[#00FF55] font-sans tracking-[0.2em] font-light">IMAGINE STUDIO</span>
                </div>
              </div>

              {/* AREA INFERIOR - CORPO REGRAS DINÂMICAS EM GRID/COLUNAS */}
              <div className="flex-1 w-full grid grid-cols-2 gap-x-16 gap-y-12 px-24 font-sans relative z-10 py-16 items-center place-content-center">

                {currentRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-8 w-full group hover:bg-[#111] p-6 rounded-3xl transition-colors">
                    <div className="w-[120px] h-[120px] flex-shrink-0 bg-black rounded-full flex items-center justify-center border-4 shadow-xl mt-2" style={{ borderColor: rule.color, boxShadow: `0 0 30px ${rule.color}30` }}>
                      {/* Renderiza o Ícone Dinamicamente */}
                      <rule.icon size={55} color={rule.color} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="text-[40px] font-bold text-white leading-none mb-3 tracking-wide uppercase" style={{ textShadow: `0 0 20px ${rule.color}60` }}>
                        {rule.title}
                      </h3>
                      <p className="text-[28px] text-gray-300 font-light leading-normal w-full">
                        {rule.text}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PrintCard;
