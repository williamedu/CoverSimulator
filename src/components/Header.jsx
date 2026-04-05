export default function Header({ step = 1 }) {
  return (
    <header className="w-full pt-6 pb-2 flex flex-col items-center bg-[#fafafa]">
      <div className="flex items-center justify-center w-full max-w-xs px-4">
        
        {/* Paso 1: DISEÑO */}
        <div className="flex flex-col items-center">
          {step === 1 ? (
            // Estado: ACTIVO
            <div className="w-12 h-12 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center mb-1">
              <div className="w-9 h-9 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold">
                1
              </div>
            </div>
          ) : (
            // Estado: COMPLETADO (Cuando estamos en el paso 2)
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center mb-2 mt-1 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <span className={`text-xs font-bold tracking-widest ${step === 1 ? 'text-black' : 'text-gray-800'}`}>
            DISEÑO
          </span>
        </div>

        {/* Línea conectora */}
        <div className={`flex-1 h-px mx-4 -mt-6 transition-colors duration-500 ${step === 2 ? 'bg-[#1a1a1a]' : 'bg-gray-300'}`}></div>

        {/* Paso 2: ENVÍO */}
        <div className="flex flex-col items-center">
          {step === 2 ? (
            // Estado: ACTIVO
            <div className="w-12 h-12 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center mb-1 animate-fade-in">
              <div className="w-9 h-9 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold">
                2
              </div>
            </div>
          ) : (
            // Estado: PENDIENTE
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold mb-2 mt-1">
              2
            </div>
          )}
          <span className={`text-xs font-bold tracking-widest ${step === 2 ? 'text-black' : 'text-gray-400'}`}>
            ENVÍO
          </span>
        </div>

      </div>
    </header>
  );
}