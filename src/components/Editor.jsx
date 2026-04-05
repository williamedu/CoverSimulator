import { useState } from 'react';
import CaseGraphic from './CaseGraphic';
import CheckoutForm from './CheckoutForm';
import Header from './Header'; 
import { caseColors, detailColorsList, iconsList, phoneModels } from '../utils/constants';

export default function Editor() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Editor, 2: Formulario de pago
  
  // Estado para controlar qué paso del acordeón está abierto (1, 2 o 3)
  const [activeAccordion, setActiveAccordion] = useState(1);

  const [activeModelId, setActiveModelId] = useState(phoneModels[0].id);
  const [initials, setInitials] = useState('MD');
  const [activeColorHex, setActiveColorHex] = useState('#166534'); 
  const [activeIconId, setActiveIconId] = useState('Anchor'); 
  const [detailsColor, setDetailsColor] = useState('#D4AF37'); 

  const ActiveIconComponent = iconsList.find(i => i.id === activeIconId).component;
  const activeModel = phoneModels.find(m => m.id === activeModelId);
  const selectedBaseColorName = caseColors.find(c => c.hex === activeColorHex)?.name;
  const selectedDetailColorName = detailColorsList.find(c => c.hex === detailsColor)?.name;

  // ==========================================
  // PANTALLA 2: FORMULARIO DE ENVÍO / CHECKOUT
  // ==========================================
  if (currentStep === 2) {
    return (
      <div className="w-full">
        <Header step={2} /> 
        <CheckoutForm 
          onBack={() => setCurrentStep(1)} 
          designData={{
            modelo: activeModel.name,
            colorBase: selectedBaseColorName,
            hex: activeColorHex,
            iniciales: initials,
            colorLetras: selectedDetailColorName,
            detailsColor: detailsColor,
            IconComponent: ActiveIconComponent,
            baseImage: activeModel.baseImage,
            textureImage: activeModel.textureImage
          }}
        />
      </div>
    );
  }

  // ==========================================
  // PANTALLA 1: EDITOR VISUAL
  // ==========================================
  return (
    <div className="w-full">
      <Header step={1} /> 

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto px-4 lg:px-8 py-2 items-start">
        
        {/* ========================================================= */}
        {/* 1. COLUMNA IZQUIERDA: VISUALIZADOR PRINCIPAL (FIJO)      */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex justify-center items-start lg:sticky lg:top-8">
          <div className="relative w-full max-w-[450px] transition-transform duration-500 ease-in-out hover:scale-105">
            <CaseGraphic 
              color={activeColorHex} 
              isMini={false} 
              initials={initials} 
              IconComponent={ActiveIconComponent} 
              detailsColor={detailsColor} 
              baseImage={activeModel.baseImage}
              textureImage={activeModel.textureImage}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. COLUMNA DERECHA: ACORDEÓN DE CONFIGURACIÓN             */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col">
          
          {/* Cabecera Ultra-Compacta (Título y Precio en la misma línea) */}
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
            <h1 className="text-xl lg:text-2xl font-serif text-gray-900">Forro Saffiano</h1>
            <p className="text-lg font-bold text-gray-900">RD$ 1,250</p>
          </div>

          <div className="space-y-3">
            
            {/* ---------------------------------------------------- */}
            {/* PASO 1: TU DISPOSITIVO Y COLOR BASE                    */}
            {/* ---------------------------------------------------- */}
            <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${activeAccordion === 1 ? 'border-gray-900 shadow-md bg-white' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
              
              <button 
                onClick={() => setActiveAccordion(1)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-widest ${activeAccordion === 1 ? 'text-black' : 'text-gray-500'}`}>
                    1. Dispositivo y Color
                  </h3>
                  {activeAccordion !== 1 && (
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {activeModel.name} • {selectedBaseColorName}
                    </p>
                  )}
                </div>
                <span className="text-2xl font-light text-gray-400">{activeAccordion === 1 ? '−' : '+'}</span>
              </button>

              {activeAccordion === 1 && (
                <div className="p-5 pt-0 border-t border-gray-100 bg-white animate-fade-in space-y-6">
                  
                  {/* Selector de Modelo */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Modelo de Celular</label>
                    <div className="relative">
                      <select
                        value={activeModelId}
                        onChange={(e) => setActiveModelId(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-300 px-4 py-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium text-gray-800 transition-colors cursor-pointer"
                      >
                        {phoneModels.map((model) => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">▼</div>
                    </div>
                  </div>

                  {/* Selector de Color Base */}
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Color de la Piel</label>
                      <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{selectedBaseColorName}</span>
                    </div>
                    
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                      {caseColors.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setActiveColorHex(c.hex)}
                          title={c.name}
                          className={`relative w-full aspect-[2/3] rounded-md transition-all p-0.5 overflow-hidden ${activeColorHex === c.hex ? 'border-2 border-black shadow-md scale-105' : 'border border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'}`}
                        >
                          <CaseGraphic color={c.hex} isMini={true} baseImage={activeModel.baseImage} textureImage={activeModel.textureImage}/>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveAccordion(2)}
                    className="w-full bg-black text-white font-bold py-3 rounded-lg text-sm transition-transform active:scale-95"
                  >
                    Continuar a Personalización →
                  </button>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* PASO 2: PERSONALIZACIÓN (INICIALES Y EMOJI)            */}
            {/* ---------------------------------------------------- */}
            <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${activeAccordion === 2 ? 'border-gray-900 shadow-md bg-white' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
              
              <button 
                onClick={() => setActiveAccordion(2)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-widest ${activeAccordion === 2 ? 'text-black' : 'text-gray-500'}`}>
                    2. Personalización
                  </h3>
                  {activeAccordion !== 2 && (
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {initials || 'Sin letras'} • Icono elegido
                    </p>
                  )}
                </div>
                <span className="text-2xl font-light text-gray-400">{activeAccordion === 2 ? '−' : '+'}</span>
              </button>

              {activeAccordion === 2 && (
                <div className="p-5 pt-0 border-t border-gray-100 bg-white animate-fade-in space-y-6">
                  
                  {/* Input de Iniciales */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Tus Letras (Máx. 4)</label>
                    <input
                      type="text"
                      maxLength="4"
                      value={initials}
                      onChange={(e) => setInitials(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 text-xl font-serif border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black uppercase bg-gray-50 text-center tracking-[0.2em]"
                      placeholder="Ej. MD"
                    />
                  </div>

                  {/* Selector de Iconos */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Elige un Detalle Mágico</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="grid grid-cols-5 gap-3">
                        {iconsList.map((item) => {
                          const isSelected = activeIconId === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveIconId(item.id)}
                              className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                                isSelected ? 'bg-white border-2 border-black shadow-sm scale-110' : 'hover:bg-gray-200 border-2 border-transparent'
                              }`}
                            >
                              <item.component size={24} weight={isSelected ? "fill" : "regular"} color={isSelected ? '#000' : '#6b7280'} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveAccordion(3)}
                    className="w-full bg-black text-white font-bold py-3 rounded-lg text-sm transition-transform active:scale-95"
                  >
                    Elegir Colores de Letras →
                  </button>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* PASO 3: DETALLES FINALES (COLOR DE LETRAS)             */}
            {/* ---------------------------------------------------- */}
            <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${activeAccordion === 3 ? 'border-gray-900 shadow-md bg-white' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
              
              <button 
                onClick={() => setActiveAccordion(3)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-widest ${activeAccordion === 3 ? 'text-black' : 'text-gray-500'}`}>
                    3. Color del Estampado
                  </h3>
                  {activeAccordion !== 3 && (
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {selectedDetailColorName}
                    </p>
                  )}
                </div>
                <span className="text-2xl font-light text-gray-400">{activeAccordion === 3 ? '−' : '+'}</span>
              </button>

              {activeAccordion === 3 && (
                <div className="p-5 pt-0 border-t border-gray-100 bg-white animate-fade-in space-y-6">
                  
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Color de Letras e Ícono</label>
                      <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{selectedDetailColorName}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 justify-start">
                      {detailColorsList.map((c) => {
                        const isSelected = detailsColor === c.hex;
                        return (
                          <button
                            key={c.hex}
                            onClick={() => setDetailsColor(c.hex)}
                            title={c.name}
                            className={`w-10 h-10 rounded-full transition-all border-[3px] shadow-sm ${
                              isSelected ? 'border-gray-900 scale-110' : 'border-white hover:scale-105 ring-1 ring-gray-200'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* EL BOTÓN FINAL PARA COMPRAR SOLO SALE EN EL ÚLTIMO PASO */}
                  <div className="pt-4 border-t border-dashed border-gray-200">
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg shadow-green-500/30 flex justify-center items-center gap-2"
                    >
                      🛒 Ir a Pagar (RD$ 1,250.00)
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}