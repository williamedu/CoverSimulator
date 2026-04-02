export default function Header() {
  return (
    <header className="w-full pt-8 pb-4 flex flex-col items-center bg-[#fafafa]">
      {/* Contenedor de los pasos */}
      <div className="flex items-center justify-center w-full max-w-lg px-4">
        
        {/* Paso 1: INFO (Completado) */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-bold tracking-widest text-[#1a1a1a]">INFO</span>
        </div>

        {/* Línea conectora negra */}
        <div className="flex-1 h-px bg-[#1a1a1a] mx-2 -mt-6"></div>

        {/* Paso 2: MODELO (Completado) */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-bold tracking-widest text-[#1a1a1a]">MODELO</span>
        </div>

        {/* Línea conectora negra */}
        <div className="flex-1 h-px bg-[#1a1a1a] mx-2 -mt-6"></div>

        {/* Paso 3: DISEÑO (Activo) */}
        <div className="flex flex-col items-center">
          {/* Este tiene un borde extra para denotar que está activo */}
          <div className="w-12 h-12 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center mb-1">
            <div className="w-9 h-9 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold">
              3
            </div>
          </div>
          <span className="text-xs font-bold tracking-widest text-[#1a1a1a]">DISEÑO</span>
        </div>

        {/* Línea conectora gris (Pendiente) */}
        <div className="flex-1 h-px bg-gray-300 mx-2 -mt-6"></div>

        {/* Paso 4: ENVÍO (Pendiente) */}
        <div className="flex flex-col items-center opacity-40">
          <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold mb-2">
            4
          </div>
          <span className="text-xs font-bold tracking-widest text-gray-500">ENVÍO</span>
        </div>

      </div>
    </header>
  );
}