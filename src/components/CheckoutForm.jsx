import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config"; 
import CaseGraphic from './CaseGraphic';
import { domexSucursales } from '../utils/shippingData'; 
import { iconsList } from '../utils/constants'; 
import BankModal from './BankModal';
import DomexModal from './DomexModal';         // <-- AGREGA ESTA
import LocationModal from './LocationModal';   // <-- Y ESTA

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
{/* 1. MODAL DE SUCURSALES (Aislado) */}
      {isModalOpen && (
        <DomexModal 
          selectedRegion={selectedRegion}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsModalOpen={setIsModalOpen}
          chunkedBranches={chunkedBranches}
          handleSelectBranch={handleSelectBranch}
          selectedBranch={selectedBranch}
          formatBranchName={formatBranchName}
        />
      )}

      {/* 2. MODAL DE UBICACIONES CERCANAS (Aislado) */}
      {showLocationModal && (
        <LocationModal 
          setShowLocationModal={setShowLocationModal}
          closestBranches={closestBranches}
          handleSelectBranch={handleSelectBranch}
          formatBranchName={formatBranchName}
        />
      )}
     
      {/* 3. MODAL DE INSTRUCCIONES DE TRANSFERENCIA (Componente Aislado) */}
      {showBankModal && <BankModal orderId={orderId} linkWhatsApp={linkWhatsApp} />}

    </div>
  );
}