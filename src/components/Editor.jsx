import { useState } from 'react';
// Importamos tus imágenes maestras
import fullcase from '../assets/fullcase.png';
import textureOnly from '../assets/textureOnly.png';
import { 
  Diamond, Skull, Alien, Crown, Heart, Star, 
  Lightning, Rocket, Anchor, Camera, Fire, Moon 
} from '@phosphor-icons/react';

// ==========================================
// 1. COMPONENTE "SANDWICH" (NUEVA VERSIÓN SUTIL)
// ==========================================
const CaseGraphic = ({ color, isMini = false, initials = '', IconComponent = null }) => {
  return (
    // Contenedor relativo para apilar capas
    <div className="relative w-full flex items-center justify-center">
      
      {/* CAPA 1: La Base (Cámara, bordes negros y sombra del piso) */}
      {/* Es 'block h-auto' para dar la altura real al diseño */}
      <img
        src={fullcase}
        alt="Forro Base"
        className="block w-full h-auto object-contain"
      />

      {/* CAPA 2: El Color (Se tiñe y usa la textura recortada como molde) */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: color,
          // La magia del molde:
          WebkitMaskImage: `url(${textureOnly})`,
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          maskImage: `url(${textureOnly})`,
          maskSize: 'contain',
          maskPosition: 'center',
          maskRepeat: 'no-repeat',
          mixBlendMode: 'multiply' 
          // HEMOS ELIMINADO EL TRANSFORM (SCALE) AQUÍ.
        }}
      />

      {/* CAPA 3: Los Detalles (Solo se muestran si NO es miniatura) */}
      {!isMini && (
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {/* Iniciales con resplandor REFINADO Y SUTIL */}
          <div
            className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-3xl md:text-1xl tracking-widest text-[#D4AF37]"
            style={{
              // Sombra blanca extremadamente reducida y sutil
              textShadow: '0 0 3px rgba(255,255,255,0.5)' 
            }}
          >
            {initials}
          </div>
          
          {/* Icono Vectorial con resplandor REFINADO Y SUTIL */}
          {IconComponent && (
            <div
              className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-[#D4AF37]"
              style={{
                // Drop-shadow suave y pequeño
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
  const [activeColorHex, setActiveColorHex] = useState('#8B4513'); // Marrón por defecto
  const [activeIconId, setActiveIconId] = useState('Diamond');

  // Nueva paleta de colores para el forro
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
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-6 md:p-8 gap-12 items-start overflow-hidden">
      
      {/* ========================================== */}
      {/* COLUMNA IZQUIERDA: VISUALIZADOR PRINCIPAL */}
      {/* ========================================== */}
      <div className="w-full md:w-1/2 flex justify-center items-start relative min-h-[500px]">
        {/* IMAGEN GRANDE Y DESTACADA */}
        <div 
          className="relative w-full max-w-[600px]"
          // Un pequeño aumento de escala general para que resalte bien
          style={{ transform: 'scale(1.1)', transformOrigin: 'top center' }}
        >
          {/* Renderizamos el forro en GRANDE, pasándole los detalles */}
          <CaseGraphic 
            color={activeColorHex} 
            isMini={false} 
            initials={initials} 
            IconComponent={ActiveIconComponent} 
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* COLUMNA DERECHA: LOS CONTROLES */}
      {/* ========================================== */}
      <div className="w-full md:w-1/2 flex flex-col items-start space-y-8">
        
        <div className="w-full border-b border-gray-200 pb-4">
          <h1 className="text-4xl font-serif text-gray-900 mb-3">Forro de Piel Saffiano</h1>
          <p className="text-2xl font-light text-gray-700">DOP 1,250.00</p>
        </div>

        {/* 1. Selector de Color de Forro (Miniaturas) */}
        <div className="w-full">
          <div className="flex items-baseline gap-2 mb-3">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              1. Color:
            </label>
            <span className="text-gray-600 font-medium">
              {caseColors.find(c => c.hex === activeColorHex)?.name}
            </span>
          </div>
          
          {/* Cuadrícula de miniaturas */}
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
            {caseColors.map((c) => {
              const isSelected = activeColorHex === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => setActiveColorHex(c.hex)}
                  title={c.name}
                  // Sin altura fija para que se adapte al contenido
                  className={`relative w-[60px] rounded-lg transition-all p-1 ${
                    isSelected 
                      ? 'border-2 border-black shadow-md scale-105' 
                      : 'border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {/* Renderizamos el forro en PEQUEÑO, solo con el color */}
                  <CaseGraphic color={c.hex} isMini={true} />
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Input de Iniciales */}
        <div className="w-full">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            2. Tus Iniciales (Máx. 4)
          </label>
          <input
            type="text"
            maxLength="4"
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            className="w-full max-w-[250px] px-4 py-3 text-2xl font-serif border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] uppercase"
            placeholder="Ej. MD"
          />
        </div>

        {/* 3. Selector de Iconos */}
        <div className="w-full">
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            3. Selecciona tu Detalle
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {iconsList.map((item) => {
                const isSelected = activeIconId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIconId(item.id)}
                    className={`flex items-center justify-center p-2 rounded-md transition-all ${
                      isSelected 
                        ? 'bg-white border-2 border-[#1a1a1a] shadow-sm scale-110' 
                        : 'hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    <item.component 
                      size={28} 
                      weight={isSelected ? "fill" : "regular"} 
                      color={isSelected ? '#1a1a1a' : '#6b7280'} 
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full pt-4">
          <button className="w-full max-w-[400px] bg-[#1a1a1a] hover:bg-black text-white font-bold py-5 px-8 rounded transition-colors text-xl shadow-xl">
            Agregar al Carrito
          </button>
        </div>

      </div>
    </div>
  );
}