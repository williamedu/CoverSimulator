import { useState } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import Dashboard from './components/Dashboard';

function App() {
  // Interruptor principal: 'tienda' o 'dashboard'
  const [currentView, setCurrentView] = useState('tienda');

  // Si el interruptor está en 'dashboard', mostramos el panel
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Barra superior del Dashboard con botón para volver */}
        <div className="w-full bg-white border-b border-gray-200 p-4 flex justify-end px-8">
          <button 
            onClick={() => setCurrentView('tienda')}
            className="bg-[#1a1a1a] text-white font-bold py-2 px-6 rounded text-sm hover:bg-black transition-colors shadow-md"
          >
            ← Volver a la Tienda
          </button>
        </div>
        <Dashboard />
      </div>
    );
  }

  // Si el interruptor está en 'tienda', mostramos tu código original
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
      {/* Botoncito discreto arriba para ir al Dashboard (solo para ti) */}
      <div className="w-full bg-gray-200 p-2 flex justify-end pr-8">
         <button 
            onClick={() => setCurrentView('dashboard')}
            className="text-xs text-gray-500 hover:text-black font-bold tracking-widest uppercase transition-colors"
         >
            Ver Dashboard →
         </button>
      </div>

      {/* Cabecera de progreso */}
      <Header />

      {/* Área de trabajo */}
      <main className="flex-1 w-full pb-10">
        <div className="text-center mt-6 mb-8">
          <h2 className="text-3xl italic font-serif text-gray-800 mb-2">Diseña tu Forro</h2>
          <p className="text-gray-400 text-xs tracking-widest uppercase">Personaliza cada detalle</p>
        </div>

        {/* Aquí insertamos nuestro nuevo componente Editor */}
        <Editor />
      </main>
    </div>
  );
}

export default App;