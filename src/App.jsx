import Header from './components/Header';
import Editor from './components/Editor';

function App() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
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