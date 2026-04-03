import { useState } from 'react';
import CaseGraphic from './CaseGraphic';
import CheckoutForm from './CheckoutForm'; // <--- AGREGAMOS ESTA LÍNEA
// NUEVO: Importamos phoneModels
import { caseColors, detailColorsList, iconsList, phoneModels } from '../utils/constants';

export default function Editor() {
  // NUEVO: Interruptor para cambiar entre Diseñador (1) y Formulario (2)
  const [currentStep, setCurrentStep] = useState(1);

  // NUEVO ESTADO: Guardamos el ID del modelo seleccionado (Por defecto el primero de la lista)
  const [activeModelId, setActiveModelId] = useState(phoneModels[0].id);
  
  const [initials, setInitials] = useState('MD');
  const [activeColorHex, setActiveColorHex] = useState('#166534'); 
  const [activeIconId, setActiveIconId] = useState('Anchor'); 
  const [detailsColor, setDetailsColor] = useState('#D4AF37'); 

  const ActiveIconComponent = iconsList.find(i => i.id === activeIconId).component;
  
// NUEVO: Buscamos toda la información del modelo seleccionado actual
  const activeModel = phoneModels.find(m => m.id === activeModelId);

  // NUEVO: Si estamos en el paso 2, mostramos el formulario y detenemos el renderizado del editor
  if (currentStep === 2) {
    return (
      <CheckoutForm 
        onBack={() => setCurrentStep(1)} 
       designData={{
          modelo: activeModel.name,
          colorBase: caseColors.find(c => c.hex === activeColorHex)?.name,
          hex: activeColorHex, // <--- Color real para el visualizador
          iniciales: initials,
          colorLetras: detailColorsList.find(c => c.hex === detailsColor)?.name,
          detailsColor: detailsColor, // <--- Color de letras real
          IconComponent: ActiveIconComponent, // <--- El icono elegido
          baseImage: activeModel.baseImage, // <--- La forma del celular
          textureImage: activeModel.textureImage // <--- La textura
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-[1400px] mx-auto p-4 lg:p-8 items-start overflow-hidden">
      
      {/* 1. COLUMNA IZQUIERDA: VISUALIZADOR PRINCIPAL */}
      <div className="lg:col-span-5 flex justify-center items-start relative min-h-[500px]">
        <div 
          className="relative w-full max-w-[600px]"
          style={{ transform: 'scale(1.1)', transformOrigin: 'top center' }}
        >
          {/* NUEVO: Le pasamos las imágenes dinámicas al componente */}
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

      {/* 2. COLUMNA CENTRAL: LOS CONTROLES */}
      <div className="lg:col-span-4 flex flex-col items-start space-y-6">
        
        <div className="w-full border-b border-gray-200 pb-3">
          <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-2">Forro de Piel Saffiano</h1>
          <p className="text-xl font-light text-gray-700">DOP 1,250.00</p>
        </div>

        {/* ========================================== */}
        {/* NUEVO: 1. SELECTOR DE MODELO DE CELULAR */}
        {/* ========================================== */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            1. Modelo de Celular
          </label>
          <div className="relative">
            <select
              value={activeModelId}
              onChange={(e) => setActiveModelId(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] font-medium text-gray-800 transition-colors cursor-pointer"
            >
              {phoneModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {/* Flechita del select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Selector de Color Base (Miniaturas) */}
        <div className="w-full">
          <div className="flex items-baseline gap-2 mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              2. Color Base:
            </label>
            <span className="text-gray-600 text-sm font-medium">
              {caseColors.find(c => c.hex === activeColorHex)?.name}
            </span>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {caseColors.map((c) => {
              const isSelected = activeColorHex === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => setActiveColorHex(c.hex)}
                  title={c.name}
                  className={`relative w-full aspect-[2/3] rounded-md transition-all p-0.5 overflow-hidden ${
                    isSelected 
                      ? 'border-2 border-black shadow-sm scale-105' 
                      : 'border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <CaseGraphic 
                    color={c.hex} 
                    isMini={true} 
                    baseImage={activeModel.baseImage}
                    textureImage={activeModel.textureImage}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Input de Iniciales */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            3. Tus Iniciales (Máx. 4)
          </label>
          <input
            type="text"
            maxLength="4"
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            className="w-full max-w-[200px] px-3 py-2 text-xl font-serif border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] uppercase"
            placeholder="Ej. MD"
          />
        </div>

        {/* 4. Selector de Color para Detalles */}
        <div className="w-full">
          <div className="flex items-baseline gap-2 mb-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              4. Color Letras e Ícono:
            </label>
            <span className="text-gray-600 text-sm font-medium">
              {detailColorsList.find(c => c.hex === detailsColor)?.name}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {detailColorsList.map((c) => {
              const isSelected = detailsColor === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => setDetailsColor(c.hex)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full transition-all border-2 ${
                    isSelected 
                      ? 'border-gray-900 shadow-md scale-110' 
                      : 'border-gray-200 hover:scale-105 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* 5. Selector de Iconos */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            5. Selecciona tu Detalle
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-6 gap-2">
              {iconsList.map((item) => {
                const isSelected = activeIconId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIconId(item.id)}
                    className={`flex items-center justify-center p-1.5 rounded-md transition-all ${
                      isSelected 
                        ? 'bg-white border-2 border-[#1a1a1a] shadow-sm scale-110' 
                        : 'hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    <item.component 
                      size={22} 
                      weight={isSelected ? "fill" : "regular"} 
                      color={isSelected ? '#1a1a1a' : '#6b7280'} 
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    {/* 3. COLUMNA DERECHA: BOTÓN DE COMPRA */}
      <div className="lg:col-span-3 flex flex-col pt-4 lg:pt-0 self-center">
        <button 
          onClick={() => setCurrentStep(2)}
          className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-xl flex justify-center items-center gap-2"
        >
          Siguiente Paso
        </button>
      </div>

    </div>
  );
}