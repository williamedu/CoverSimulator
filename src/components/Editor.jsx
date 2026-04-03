import { useState } from 'react';
// Importamos tus imágenes maestras
import fullcase from '../assets/fullcase.png';
import textureOnly from '../assets/textureOnly.png';
import { 
  Diamond, Skull, Alien, Crown, Heart, Star, 
  Lightning, Rocket, Anchor, Camera, Fire, Moon 
} from '@phosphor-icons/react';

// ==========================================
// 1. COMPONENTE "SANDWICH" 
// ==========================================
const CaseGraphic = ({ color, isMini = false, initials = '', IconComponent = null, detailsColor = '#D4AF37' }) => {
  return (
    <div className="relative w-full flex items-center justify-center">
      
      {/* CAPA 1: La Base */}
      <img
        src={fullcase}
        alt="Forro Base"
        className="block w-full h-auto object-contain"
      />

      {/* CAPA 2: El Color de la Textura */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url(${textureOnly})`,
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          maskImage: `url(${textureOnly})`,
          maskSize: 'contain',
          maskPosition: 'center',
          maskRepeat: 'no-repeat',
          mixBlendMode: 'multiply' 
        }}
      />

      {/* CAPA 3: Los Detalles */}
      {!isMini && (
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {/* Iniciales */}
          <div
            className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-3xl md:text-4xl tracking-widest"
            style={{
              color: detailsColor,
              textShadow: '0 0 3px rgba(255,255,255,0.5)' 
            }}
          >
            {initials}
          </div>
          
          {/* Icono Vectorial */}
          {IconComponent && (
            <div
              className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
              style={{
                color: detailsColor,
                filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4))'
              }}
            >
              <IconComponent size={30} weight="fill" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. EL COMPONENTE PRINCIPAL DEL EDITOR
// ==========================================
export default function Editor() {
  const [initials, setInitials] = useState('MD');
  const [activeColorHex, setActiveColorHex] = useState('#166534'); // Verde Bosque por defecto (como en tu foto)
  const [activeIconId, setActiveIconId] = useState('Anchor'); // Ancla por defecto
  const [detailsColor, setDetailsColor] = useState('#D4AF37'); // Dorado por defecto

  // Paleta de colores para el forro base
  const caseColors = [
    { name: 'Azul Real', hex: '#1D4ED8' },
    { name: 'Marrón Clásico', hex: '#8B4513' },
    { name: 'Verde Bosque', hex: '#166534' },
    { name: 'Negro Profundo', hex: '#1A1A1A' },
    { name: 'Gris Claro', hex: '#E5E7EB' },
    { name: 'Rojo Carmesí', hex: '#DC2626' },
    { name: 'Naranja Vivo', hex: '#EA580C' },
    { name: 'Lavanda', hex: '#A78BFA' },
    { name: 'Celeste', hex: '#7DD3FC' },
    { name: 'Crema', hex: '#FEF3C7' },
    { name: 'Rosa Pastel', hex: '#F9A8D4' },
    { name: 'Vino', hex: '#7F1D1D' }
  ];

  // Paleta de colores FIJOS para los detalles (Letras e Ícono)
  const detailColorsList = [
    { name: 'Dorado', hex: '#D4AF37' },
    { name: 'Plata', hex: '#C0C0C0' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Negro', hex: '#1A1A1A' },
    { name: 'Vino', hex: '#7F1D1D' },
    { name: 'Rojo Clásico', hex: '#DC2626' },
    { name: 'Turquesa', hex: '#40E0D0' },
    { name: 'Azul Rey', hex: '#1D4ED8' },
    { name: 'Amarillo', hex: '#EAB308' },
    { name: 'Verde Esmeralda', hex: '#059669' },
    { name: 'Rosa Fuerte', hex: '#DB2777' },
    { name: 'Morado', hex: '#9333EA' }
  ];

  const iconsList = [
    { id: 'Diamond', component: Diamond },
    { id: 'Skull', component: Skull },
    { id: 'Alien', component: Alien },
    { id: 'Crown', component: Crown },
    { id: 'Heart', component: Heart },
    { id: 'Star', component: Star },
    { id: 'Lightning', component: Lightning },
    { id: 'Rocket', component: Rocket },
    { id: 'Anchor', component: Anchor },
    { id: 'Camera', component: Camera },
    { id: 'Fire', component: Fire },
    { id: 'Moon', component: Moon }
  ];

  const ActiveIconComponent = iconsList.find(i => i.id === activeIconId).component;

  return (
    // CAMBIO CLAVE: Usamos Grid de 12 columnas para controlar perfectamente los anchos
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-[1400px] mx-auto p-4 lg:p-8 items-start overflow-hidden">
      
      {/* ========================================== */}
      {/* 1. COLUMNA IZQUIERDA: VISUALIZADOR PRINCIPAL (Ocupa 5 de 12 columnas) */}
      {/* ========================================== */}
      <div className="lg:col-span-5 flex justify-center items-start relative min-h-[500px]">
        {/* Restauramos el tamaño grande de la funda */}
        <div 
          className="relative w-full max-w-[600px]"
          style={{ transform: 'scale(1.1)', transformOrigin: 'top center' }}
        >
          <CaseGraphic 
            color={activeColorHex} 
            isMini={false} 
            initials={initials} 
            IconComponent={ActiveIconComponent} 
            detailsColor={detailsColor} 
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. COLUMNA CENTRAL: LOS CONTROLES (Ocupa 4 de 12 columnas) */}
      {/* ========================================== */}
      <div className="lg:col-span-4 flex flex-col items-start space-y-6"> {/* space-y-6 para juntar más los elementos */}
        
        <div className="w-full border-b border-gray-200 pb-3">
          <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-2">Forro de Piel Saffiano</h1>
          <p className="text-xl font-light text-gray-700">DOP 1,250.00</p>
        </div>

        {/* 1. Selector de Color Base (Miniaturas) */}
        <div className="w-full">
          <div className="flex items-baseline gap-2 mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              1. Color Base:
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
                  className={`relative w-full aspect-[2/3] rounded-md transition-all p-0.5 ${
                    isSelected 
                      ? 'border-2 border-black shadow-sm scale-105' 
                      : 'border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <CaseGraphic color={c.hex} isMini={true} />
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Input de Iniciales */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            2. Tus Iniciales (Máx. 4)
          </label>
          <input
            type="text"
            maxLength="4"
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            // Reducimos un poco el padding (py-2) para ahorrar espacio vertical
            className="w-full max-w-[200px] px-3 py-2 text-xl font-serif border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] uppercase"
            placeholder="Ej. MD"
          />
        </div>

        {/* 3. Selector de Color para Detalles (COMPACTO) */}
        <div className="w-full">
          <div className="flex items-baseline gap-2 mb-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              3. Color Letras e Ícono:
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
                  // CAMBIO: Círculos más pequeños (w-7 h-7)
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

        {/* 4. Selector de Iconos (COMPACTO) */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            4. Selecciona tu Detalle
          </label>
          {/* Reducimos el padding de la caja gris */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-6 gap-2">
              {iconsList.map((item) => {
                const isSelected = activeIconId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIconId(item.id)}
                    // Reducimos el padding del botón (p-1.5)
                    className={`flex items-center justify-center p-1.5 rounded-md transition-all ${
                      isSelected 
                        ? 'bg-white border-2 border-[#1a1a1a] shadow-sm scale-110' 
                        : 'hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    {/* CAMBIO: Íconos más pequeños (size 22) */}
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

    {/* ========================================== */}
      {/* 3. COLUMNA DERECHA: BOTÓN DE COMPRA (Ocupa 3 de 12 columnas) */}
      {/* ========================================== */}
      {/* Agregamos 'self-center' para centrarlo verticalmente y quitamos el sticky */}
      <div className="lg:col-span-3 flex flex-col pt-4 lg:pt-0 self-center">
        {/* Aquí mantenemos tu estilo original negro, flotando a la derecha */}
        <button className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-xl flex justify-center items-center gap-2">
          Agregar al Carrito
        </button>
      </div>

    </div>
  );
}