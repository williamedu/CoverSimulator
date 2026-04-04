import { useState } from 'react';
import CaseGraphic from './CaseGraphic'; // <--- Importamos el visualizador

export default function CheckoutForm({ onBack, designData }) {
  // Estado para guardar lo que el cliente escribe
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    sucursalBM: ''
  });

  // Función para actualizar el estado cuando escriben
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función cuando le dan a "Confirmar Pedido"
  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo veremos los datos en la consola para asegurarnos de que funciona
    console.log("DISEÑO ELEGIDO:", designData);
    console.log("DATOS DEL CLIENTE:", formData);
    alert("¡Simulación exitosa! Revisa la consola para ver los datos.");
  };

  return (
   <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-10 shadow-sm">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="flex-1">
            <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-serif text-gray-900 mb-2">Detalles de Envío</h2>
                <p className="text-sm text-gray-600">Recogida en sucursal BM Cargo.</p>
              </div>
              <button 
                onClick={onBack}
                className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
              >
                ← Editar Diseño
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nombre</label>
              <input type="text" name="nombre" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors" placeholder="Ej. jose" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Apellido</label>
              <input type="text" name="apellido" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors" placeholder="Ej. Hiciano" />
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Correo Electrónico</label>
              <input type="email" name="correo" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors" placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Teléfono / WhatsApp</label>
              <input type="tel" name="telefono" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors" placeholder="809-000-0000" />
            </div>
          </div>

          {/* BM Cargo */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Sucursal de BM Cargo</label>
            <input type="text" name="sucursalBM" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors" placeholder="Ej. Piantini, Santiago, etc." />
            <p className="text-xs text-gray-500 mt-2">Indica la sucursal donde deseas retirar tu pedido.</p>
          </div>

            {/* Botón Final */}
            <div className="pt-6">
              <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-xl">
                Finalizar Pedido
              </button>
            </div>
          </form>
        </div>
  
            {/* COLUMNA DERECHA: MINIATURA DEL DISEÑO */}
            <div className="w-full lg:w-72 bg-gray-50 rounded-xl p-6 border border-gray-100 self-start">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Tu Diseño</h3>
            
           <div className="relative w-full aspect-[2/3] mb-6 drop-shadow-2xl">
              <CaseGraphic 
                color={designData.hex}
                initials={designData.iniciales}
                IconComponent={designData.IconComponent}
                detailsColor={designData.detailsColor}
                baseImage={designData.baseImage}
                textureImage={designData.textureImage}
                // AQUÍ CONTROLAS EL TAMAÑO SOLO PARA ESTA PANTALLA:
                textSize="text-xl md:text-1xl" // Hazlo más pequeño (text-xl, text-lg, text-base, etc.)
                iconSize={20} // Haz el icono más pequeño (ej. 20, 18, 15)
              />
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-900">{designData.modelo}</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Color Base:</span>
                <span className="font-bold text-gray-700">{designData.colorBase}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Iniciales:</span>
                <span className="font-bold text-gray-700">{designData.iniciales || 'Ninguna'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Detalles:</span>
                <span className="font-bold text-gray-700">{designData.colorLetras}</span>
              </div>
            </div>
          </div>

        </div> {/* Cierre del flex-row */}

      </div>
    </div>
  );
}