import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config"; 
import CaseGraphic from './CaseGraphic';
import { phoneModels, iconsList } from '../utils/constants';

// Función para poner la fecha bonita, más compacta
const formatearFechaCompacta = (isoString) => {
  if (!isoString) return 'Desconocida';
  const fecha = new Date(isoString);
  return fecha.toLocaleDateString('es-DO', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pendientes'); 
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador

  // 1. CONECTAR CON FIREBASE EN TIEMPO REAL
  useEffect(() => {
    const q = query(collection(db, 'ordenes'), orderBy('metadatos.fecha_creacion', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordenesFirebase = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordenesFirebase);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. FUNCIÓN PARA ACTUALIZAR EL ESTADO (CONFIRMAR PAGO)
  const marcarComoPagada = async (orderId) => {
    try {
      const orderRef = doc(db, "ordenes", orderId);
      await updateDoc(orderRef, {
        "metadatos.estado": "pagada"
      });
    } catch (error) {
      console.error("Error al actualizar: ", error);
      alert("Hubo un error al actualizar el estado.");
    }
  };

  // 3. FUNCIÓN PARA REGRESAR A PENDIENTES
  const moverAPendientes = async (orderId) => {
    try {
      const orderRef = doc(db, "ordenes", orderId);
      await updateDoc(orderRef, {
        "metadatos.estado": "pendiente_verificacion"
      });
    } catch (error) {
      console.error("Error al mover de vuelta: ", error);
      alert("Hubo un error al regresar la orden a pendientes.");
    }
  };

  // 4. FUNCIÓN PARA BORRAR UNA ORDEN
  const borrarOrden = async (orderId) => {
    const confirmacion = window.confirm("¿Estás 100% seguro de borrar esta orden? Esta acción no se puede deshacer.");
    if (!confirmacion) return;

    try {
      const orderRef = doc(db, "ordenes", orderId);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error("Error al borrar: ", error);
      alert("Hubo un error al intentar borrar la orden.");
    }
  };

  // 5. LÓGICA DE FILTRADO COMBINADA (PESTAÑA + BUSCADOR)
  const ordenesFiltradas = orders.filter(order => {
    // 1. Filtro de pestaña
    const estado = order.metadatos?.estado;
    let pasaPestana = false;
    if (activeTab === 'pendientes') {
      pasaPestana = estado === 'pendiente_verificacion' || estado === 'pendiente';
    } else {
      pasaPestana = estado === 'pagada' || estado === 'completada' || estado === 'enviada';
    }

    // 2. Filtro de búsqueda (en el ID corto)
    const idCorto = order.id.slice(-6).toUpperCase();
    const pasaBusqueda = idCorto.includes(searchTerm.toUpperCase());

    return pasaPestana && pasaBusqueda;
  });

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-bold text-lg">Cargando órdenes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8 font-sans">
      
      {/* Cabecera del Dashboard con Buscador y Pestañas */}
      <div className="max-w-7xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Panel de Control</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestión compacta de órdenes</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          
          {/* BUSCADOR */}
          <div className="relative w-full md:w-56">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar # orden..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] text-sm transition-colors"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black">✕</button>
            )}
          </div>

          {/* PESTAÑAS */}
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto text-xs font-bold gap-1">
            <button 
              onClick={() => setActiveTab('pendientes')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded transition-colors ${activeTab === 'pendientes' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Pendientes
            </button>
            <button 
              onClick={() => setActiveTab('pagadas')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded transition-colors ${activeTab === 'pagadas' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Pagadas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Órdenes Ultra-Compacta */}
      <div className="max-w-7xl mx-auto space-y-2.5">
        {ordenesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400 border border-gray-200 border-dashed">
            <p className="text-sm">No se encontraron órdenes {searchTerm ? 'con ese número' : (activeTab === 'pendientes' ? 'pendientes' : 'pagadas')}.</p>
          </div>
        ) : (
          ordenesFiltradas.map((order) => {
            const OrderIcon = iconsList.find(i => i.id === order.personalizacion?.iconoId)?.component || null;
            const idCorto = order.id.slice(-6).toUpperCase();
            
            // LA MAGIA ESTÁ AQUÍ: Busca el modelo exacto que el cliente compró
            const matchedModel = phoneModels.find(m => m.name === order.dispositivo_modelo) || phoneModels[0];

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center relative transition-hover hover:border-gray-300">
                
                {/* Indicador de Estado Lateral */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeTab === 'pendientes' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>

              {/* 1. CAJA DE IMAGEN CON ZOOM AJUSTADO */}
                <div className="w-20 md:w-24 h-28 md:h-32 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0 shadow-sm flex items-center justify-center overflow-hidden ml-2">
                  <div className="relative w-full aspect-[2/3] scale-120 mt-15">
                   <CaseGraphic 
                      color={order.dispositivo_color_hex || '#333333'} 
                      initials={order.personalizacion?.texto || ''}
                      IconComponent={OrderIcon}
                      detailsColor={order.personalizacion?.color_letras_hex || '#D4AF37'} 
                      baseImage={matchedModel.baseImage} 
                      textureImage={matchedModel.textureImage}
                      textSize="text-[10px] font-bold" 
                      iconSize={14}
                    />
                  </div>
                </div>

                {/* 2. GRILLA DE DATOS (4 Columnas perfectas) */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-center">
                  
                  {/* Columna 1: ID, Estado, Fecha, Total */}
                  <div className="text-[11px] space-y-0.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">📦</span>
                      <h2 className="text-base font-bold text-gray-900 leading-tight">#{idCorto}</h2>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${activeTab === 'pendientes' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {activeTab === 'pendientes' ? 'Pendiente' : 'Pagada'}
                      </span>
                    </div>
                    <p className="text-gray-500">{formatearFechaCompacta(order.metadatos?.fecha_creacion)}</p>
                    <p className="font-bold text-black mt-0.5">RD$ {order.metadatos?.total_pagar}</p>
                  </div>

                  {/* Columna 2: Detalles del Diseño */}
                  <div className="text-[11px] text-gray-700 space-y-0.5">
                    <p className="font-bold text-gray-900 text-sm leading-snug">{order.dispositivo_modelo}</p>
                    <p><span className="text-gray-400">Color:</span> {order.dispositivo_color_base}</p>
                    <p><span className="text-gray-400">Texto:</span> {order.personalizacion?.texto || 'N/A'}</p>
                  </div>

                  {/* Columna 3: Datos del Cliente y Envío */}
                  <div className="text-[11px] text-gray-700 space-y-0.5">
                    <p className="font-bold text-gray-900 truncate">{order.cliente_nombre}</p>
                    <p>📞 {order.cliente_telefono}</p>
                    <p className="truncate">📍 {order.logistica?.carrier_nombre} {order.logistica?.carrier_sucursal?.split('-')[1]?.trim()}</p>
                  </div>

                  {/* Columna 4: ACCIONES */}
                  <div className="flex flex-col xl:flex-row gap-2 justify-end">
                    {activeTab === 'pendientes' ? (
                      <>
                        <button 
                          onClick={() => marcarComoPagada(order.id)}
                          className="w-full xl:w-auto bg-[#1a1a1a] hover:bg-black text-white font-bold py-2 px-3 rounded text-[11px] transition-colors shadow-sm flex justify-center items-center gap-1 leading-tight"
                        >
                          ✅ Confirmar
                        </button>
                        <button 
                          onClick={() => borrarOrden(order.id)}
                          className="w-full xl:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-3 rounded text-[11px] transition-colors flex justify-center items-center gap-1 leading-tight border border-red-100"
                        >
                          🗑️ Borrar
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => moverAPendientes(order.id)}
                        className="w-full xl:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-3 rounded text-[11px] transition-colors flex justify-center items-center gap-1.5 leading-tight"
                      >
                        ⏪ Pendientes
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}