import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config"; 
import CaseGraphic from './CaseGraphic';
import { domexSucursales } from '../utils/shippingData'; 
import { iconsList } from '../utils/constants'; // <-- AGREGA ESTA LÍNEA AQUÍ


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

export default function CheckoutForm({ onBack, designData }) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    sucursalDomex: '' 
  });

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [showBankModal, setShowBankModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [closestBranches, setClosestBranches] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

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

  const findClosestBranches = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const branchesWithDistance = domexSucursales
          .filter(b => b.coordenadas && b.coordenadas.lat && b.coordenadas.lng)
          .map(b => ({
            ...b,
            distance: calculateDistance(latitude, longitude, b.coordenadas.lat, b.coordenadas.lng)
          }))
          .sort((a, b) => a.distance - b.distance) 
          .slice(0, 6); 

        setClosestBranches(branchesWithDistance);
        setIsLocating(false); 
        setShowLocationModal(true); 
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        alert(
          "📍 ¡Ups! El GPS está bloqueado.\n\n" +
          "Para usar esta función:\n" +
          "• En iPhone (Safari): Ve a Configuración > Privacidad > Localización > Safari y elige 'Al usar la app'.\n" +
          "• En Android/Chrome: Toca el candadito (🔒) en la barra de direcciones y activa la 'Ubicación'.\n\n" +
          "Luego, recarga esta página y vuelve a intentarlo."
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectBranch = (sucursal) => {
    setSelectedRegion(sucursal.region); 
    setSelectedBranch(sucursal);
    setFormData({ ...formData, sucursalDomex: sucursal.nombre });
    setIsModalOpen(false);
    setShowLocationModal(false);
    setSearchTerm(''); 
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // NUEVO: Buscamos cuál es el ID en texto del componente que el usuario eligió
    const selectedIconObj = iconsList.find(icon => icon.component === designData.IconComponent);
    const iconIdToSave = selectedIconObj ? selectedIconObj.id : null;
    
    const ordenData = {
      cliente_nombre: `${formData.nombre} ${formData.apellido}`.trim(),
      cliente_telefono: formData.telefono,
      cliente_correo: formData.correo,
      
      dispositivo_modelo: designData.modelo,
      dispositivo_color_base: designData.colorBase || "No especificado",
      dispositivo_color_hex: designData.hex || "#333333", 
      
      personalizacion: {
        texto: designData.iniciales || "",
        iconoId: iconIdToSave,                 // <-- AHORA SÍ GUARDAMOS EL ID ENCONTRADO
        color_letras_hex: designData.detailsColor || "#D4AF37" 
      },
      
      logistica: {
        tipo_entrega: selectedRegion ? "agencia" : "personal",
        carrier_nombre: selectedRegion ? "Domex" : "",
        carrier_region: selectedRegion || "",
        carrier_sucursal: selectedBranch ? selectedBranch.nombre : "",
        carrier_direccion: selectedBranch ? selectedBranch.direccion : ""
      },
      
      metadatos: {
        fecha_creacion: new Date().toISOString(),
        estado: paymentMethod === 'transferencia' ? 'pendiente_verificacion' : 'pendiente',
        total_pagar: 1500, 
        metodo_pago: paymentMethod
      }
    };


    try {
      const docRef = await addDoc(collection(db, "ordenes"), ordenData);
      const generatedId = docRef.id.slice(-6).toUpperCase();
      setOrderId(generatedId);
      
      if (paymentMethod === 'transferencia') {
        setShowBankModal(true); 
      } else {
        alert(`Redirigiendo a Stripe para el pedido #${generatedId}... (Próximamente)`);
      }
      
    } catch (error) {
      console.error("Error guardando el pedido: ", error);
      alert("Hubo un pequeño error de conexión. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // NÚMERO DE WHATSAPP (Ajusta esto a tu número real)
  const miNumeroWhatsApp = "8094883317"; 
  const mensajeWhatsApp = `¡Hola! Acabo de realizar el pedido *#${orderId}*. Aquí te envío mi comprobante de transferencia:`;
  const linkWhatsApp = `https://wa.me/${miNumeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

  return (
   <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 animate-fade-in relative">
      <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-10 shadow-sm">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-serif text-gray-900 mb-2">Checkout</h2>
                <p className="text-sm text-gray-600">Completa tus datos para procesar la orden.</p>
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

              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Método de Envío (Domex)</h3>
                  
                  {isMobile && (
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
                  )}
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
                          src={
                            userLocation && isMobile
                              ? `https://www.google.com/maps?saddr=${userLocation.lat},${userLocation.lng}&daddr=${selectedBranch.coordenadas.lat},${selectedBranch.coordenadas.lng}&hl=es&output=embed`
                              : `https://maps.google.com/maps?q=${selectedBranch.coordenadas.lat},${selectedBranch.coordenadas.lng}&hl=es&z=16&output=embed`
                          }
                        ></iframe>
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Mapa no disponible</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Método de Pago</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <label className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'transferencia' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="transferencia" 
                      className="peer sr-only" 
                      checked={paymentMethod === 'transferencia'}
                      onChange={() => setPaymentMethod('transferencia')}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏦</span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Transferencia Bancaria</p>
                          <p className="text-xs text-gray-500">Popular / BHD</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transferencia' ? 'border-black' : 'border-gray-300'}`}>
                        {paymentMethod === 'transferencia' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                    </div>
                  </label>

                  <label className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="stripe" 
                      className="peer sr-only" 
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Tarjeta de Crédito</p>
                          <p className="text-xs text-green-600 font-medium">Próximamente</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-black' : 'border-gray-300'}`}>
                        {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                    </div>
                  </label>

                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedRegion}
                  className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-xl disabled:bg-gray-400 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? 'Procesando...' : (paymentMethod === 'transferencia' ? 'Completar Orden (RD$ 1,500)' : 'Pagar con Tarjeta')}
                </button>
                {!selectedRegion && <p className="text-center text-xs text-red-500 mt-2">Por favor, selecciona una sucursal de envío para continuar.</p>}
              </div>
            </form>
          </div>
  
          <div className="w-full lg:w-72 bg-gray-50 rounded-xl p-6 border border-gray-100 self-start">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Resumen de Orden</h3>
            
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
              
              <div className="border-t border-dashed border-gray-300 my-4 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total:</span>
                <span className="text-lg font-black text-black">RD$ 1,500</span>
              </div>
            </div>
          </div>
        </div> 
      </div>

      {/* 1. MODAL DE SUCURSALES */}
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

      {/* 2. MODAL DE UBICACIONES CERCANAS */}
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

      {/* 3. MODAL DE INSTRUCCIONES DE TRANSFERENCIA */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-center">
            
            <div className="bg-green-500 p-6 text-white">
              <div className="text-5xl mb-2">✅</div>
              <h2 className="text-2xl font-bold">¡Orden Creada!</h2>
              <p className="text-green-100 mt-1">Falta 1 paso para procesarla</p>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6">
                Tu orden <strong className="text-black">#{orderId}</strong> está en espera de pago. Por favor, transfiere <strong className="text-black">RD$ 1,500</strong> a una de las siguientes cuentas:
              </p>

              <div className="space-y-4 text-left">
                {/* BANCO 1 */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Banco Popular</p>
                  <p className="font-bold text-gray-900">Cuenta de Ahorros</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xl font-mono text-blue-600">798 555 1234</p>
                    <button onClick={() => navigator.clipboard.writeText('7985551234')} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Copiar</button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">A nombre de: William Hiciano</p>
                </div>

                {/* BANCO 2 */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Banco BHD</p>
                  <p className="font-bold text-gray-900">Cuenta Corriente</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xl font-mono text-blue-600">123 4567 890</p>
                    <button onClick={() => navigator.clipboard.writeText('1234567890')} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Copiar</button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">A nombre de: William Hiciano</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-bold">¿Ya hiciste el pago?</p>
                <a 
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-green-500/30"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  Enviar Comprobante
                </a>
                
                <button onClick={() => window.location.reload()} className="mt-4 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors">
                  Cerrar y volver al inicio
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}