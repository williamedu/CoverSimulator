import { useState } from 'react';
import CaseGraphic from './CaseGraphic';
import { domexSucursales } from '../utils/shippingData'; 

// FÓRMULA DE HAVERSINE: Calcula la distancia en kilómetros entre dos coordenadas GPS
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Devuelve la distancia en km
};

export default function CheckoutForm({ onBack, designData }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    sucursalDomex: '' 
  });

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  // ESTADOS DEL POP-UP NORMAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // NUEVOS ESTADOS PARA EL GPS
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [closestBranches, setClosestBranches] = useState([]);

  const regionesUnicas = [...new Set(domexSucursales.map(s => s.region))];
  const sucursalesFiltradas = domexSucursales.filter(s => s.region === selectedRegion);

  const searchedBranches = sucursalesFiltradas.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chunkedBranches = [];
  for (let i = 0; i < searchedBranches.length; i += 10) {
    chunkedBranches.push(searchedBranches.slice(i, i + 10));
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatBranchName = (nombre) => {
    return nombre.replace(/^DO\./, 'DOMEX ');
  };

  // NUEVA FUNCIÓN: Encontrar ubicaciones cercanas
  const findClosestBranches = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true); // Encendemos el estado de carga

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Calculamos la distancia para cada sucursal que tenga coordenadas
        const branchesWithDistance = domexSucursales
          .filter(b => b.coordenadas && b.coordenadas.lat && b.coordenadas.lng)
          .map(b => ({
            ...b,
            distance: calculateDistance(latitude, longitude, b.coordenadas.lat, b.coordenadas.lng)
          }))
          .sort((a, b) => a.distance - b.distance) // Ordenamos de menor a mayor distancia
          .slice(0, 6); // Agarramos las 6 primeras (La ganadora + 5 opciones)

        setClosestBranches(branchesWithDistance);
        setIsLocating(false); // Apagamos el estado de carga
        setShowLocationModal(true); // Abrimos el pop-up de ubicaciones
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        alert("No pudimos acceder a tu ubicación. Por favor, asegúrate de darle permisos a la página.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Función para seleccionar una sucursal desde cualquier pop-up
  const handleSelectBranch = (sucursal) => {
    setSelectedRegion(sucursal.region); // Auto-asigna la región
    setSelectedBranch(sucursal);
    setFormData({ ...formData, sucursalDomex: sucursal.nombre });
    setIsModalOpen(false);
    setShowLocationModal(false);
    setSearchTerm(''); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DISEÑO ELEGIDO:", designData);
    console.log("DATOS DEL CLIENTE:", formData);
    alert("¡Simulación exitosa! Revisa la consola.");
  };

  return (
   <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 animate-fade-in relative">
      <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-10 shadow-sm">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="flex-1">
            <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-serif text-gray-900 mb-2">Detalles de Envío</h2>
                <p className="text-sm text-gray-600">Recogida en sucursal Domex.</p>
              </div>
              <button 
                onClick={onBack}
                className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
              >
                ← Editar Diseño
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nombre</label>
                  <input type="text" name="nombre" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors" placeholder="Ej. José" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Apellido</label>
                  <input type="text" name="apellido" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors" placeholder="Ej. Hiciano" />
                </div>
              </div>

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

              {/* ========================================== */}
              {/* SECCIÓN DE ENVÍO DOMEX                       */}
              {/* ========================================== */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Método de Envío (Domex)</h3>
                  
                  {/* EL BOTÓN MÁGICO DE GPS */}
                  <button 
                    type="button"
                    onClick={findClosestBranches}
                    disabled={isLocating}
                    className="text-xs bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-wait"
                  >
                    {isLocating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Calculando distancia...
                      </>
                    ) : (
                      <>
                        <span>📍</span> Usar mi ubicación actual
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      1. Selecciona tu Región
                    </label>
                    <select 
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setSelectedBranch(null); 
                        setFormData({...formData, sucursalDomex: ''});
                      }} 
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-colors cursor-pointer bg-white"
                    >
                      <option value="">-- Región --</option>
                      {regionesUnicas.map((region, index) => (
                        <option key={index} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      2. Sucursal de Retiro
                    </label>
                    <button 
                      type="button"
                      disabled={!selectedRegion}
                      onClick={() => setIsModalOpen(true)}
                      className={`w-full px-4 py-3 border rounded text-left transition-colors flex justify-between items-center ${
                        !selectedRegion 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-gray-300 hover:border-gray-800 text-gray-800 cursor-pointer focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none'
                      }`}
                    >
                      <span className="truncate pr-4">
                        {selectedBranch ? formatBranchName(selectedBranch.nombre) : '-- Buscar y elegir sucursal --'}
                      </span>
                      {selectedRegion && <span className="text-gray-400">🔍</span>}
                    </button>
                    <input type="hidden" name="sucursalDomex" value={formData.sucursalDomex} required />
                  </div>
                </div>

                {/* VISOR DEL MAPA Y DETALLES */}
                {selectedBranch && (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden animate-fade-in shadow-sm">
                    {selectedBranch.coordenadas ? (
                      <div className="w-full h-48 bg-gray-200 relative">
                       <iframe 
  width="100%" 
  height="100%" 
  style={{ border: 0 }} 
  loading="lazy" 
  allowFullScreen 
  referrerPolicy="no-referrer-when-downgrade"
  src={`https://maps.google.com/maps?q=${selectedBranch.coordenadas.lat},${selectedBranch.coordenadas.lng}&hl=es&z=16&output=embed`}
></iframe>
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Mapa no disponible para esta sucursal</p>
                      </div>
                    )}

                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{formatBranchName(selectedBranch.nombre)}</h4>
                      <p className="text-sm text-gray-600 mb-2">{selectedBranch.direccion}</p>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-xs font-medium text-gray-700 bg-white p-2 rounded border border-gray-100">
                        <span className="flex items-center gap-1">📞 {selectedBranch.telefono}</span>
                        {selectedBranch.correo !== 'Correo no publicado' && (
                          <span className="flex items-center gap-1">✉️ {selectedBranch.correo}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                textSize="text-xl md:text-1xl" 
                iconSize={20} 
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
            </div>
          </div>
        </div> 
      </div>

      {/* ========================================== */}
      {/* MODAL POP-UP DE BÚSQUEDA MANUAL            */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder={`Buscar en ${selectedRegion}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] shadow-inner"
                  autoFocus
                />
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSearchTerm('');
                }}
                className="w-full md:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6 overflow-x-auto overflow-y-auto bg-white flex-1">
              {chunkedBranches.length > 0 ? (
                <div className="flex gap-8 w-max min-w-full">
                  {chunkedBranches.map((column, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-2 w-72 shrink-0">
                      {column.map((sucursal, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectBranch(sucursal)}
                          className={`text-left p-3 rounded-lg border transition-all ${
                            selectedBranch?.nombre === sucursal.nombre 
                              ? 'bg-black text-white border-black shadow-md' 
                              : 'bg-white border-gray-200 hover:border-gray-800 hover:shadow-sm text-gray-800'
                          }`}
                        >
                          <span className="block text-sm font-bold truncate">
                            {formatBranchName(sucursal.nombre)}
                          </span>
                          <span className="block text-xs mt-1 truncate opacity-80">
                            {sucursal.direccion}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-3xl mb-2">😕</span>
                  <p>No se encontraron sucursales con "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL POP-UP DE RESULTADOS GPS             */}
      {/* ========================================== */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl text-gray-900">Ubicaciones Cercanas a Ti</h3>
                <p className="text-sm text-gray-600">Basado en tu ubicación actual</p>
              </div>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-black font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-white flex-1 space-y-4">
              {closestBranches.map((sucursal, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectBranch(sucursal)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    idx === 0 
                      ? 'bg-green-50 border-green-500 shadow-md scale-[1.02]' 
                      : 'bg-white border-gray-200 hover:border-gray-800'
                  }`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      {idx === 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">¡La más cerca!</span>}
                      <span className={`block text-lg font-bold ${idx === 0 ? 'text-green-900' : 'text-gray-900'}`}>
                        {formatBranchName(sucursal.nombre)}
                      </span>
                    </div>
                    <span className="block text-sm text-gray-600 mb-2">
                      {sucursal.direccion}
                    </span>
                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Región: {sucursal.region}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end border-l border-gray-200 pl-4">
                    <span className="text-3xl mb-1">📍</span>
                    <span className="font-bold text-gray-900">{sucursal.distance.toFixed(1)} km</span>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}