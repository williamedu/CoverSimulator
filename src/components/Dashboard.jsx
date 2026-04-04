import CaseGraphic from './CaseGraphic';
import { phoneModels, iconsList } from '../utils/constants';

export default function Dashboard() {
  // ==========================================
  // DATOS FALSOS (MOCK DATA) DE UNA ORDEN
  // ==========================================
  const mockOrders = [
    {
      id: '#ORD-0001',
      date: '3 de Abril de 2026',
      status: 'Nueva',
      customer: {
        nombre: 'eduardo',
        apellido: 'Domínguez',
        correo: 'williamH.d@email.com',
        telefono: '809-555-0123',
        sucursalBM: 'Piantini'
      },
      designData: {
        modelo: 'iPhone 13 / 14 Pro Max',
        colorBase: 'Vino',
        hex: '#7F1D1D',
        iniciales: 'MD',
        colorLetras: 'Dorado',
        detailsColor: '#D4AF37',
        iconoId: 'Crown', // Guardamos el ID del icono
        baseImage: phoneModels[0].baseImage,
        textureImage: phoneModels[0].textureImage
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-12 font-sans">
      
      {/* Cabecera del Dashboard */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-serif text-gray-900">Panel de Control</h1>
        <p className="text-gray-500 mt-1">Gestiona tus órdenes y envíos.</p>
      </div>

      {/* Lista de Órdenes */}
      <div className="max-w-6xl mx-auto space-y-6">
        {mockOrders.map((order) => {
          // Buscamos el componente del icono real usando el ID guardado
          const OrderIcon = iconsList.find(i => i.id === order.designData.iconoId)?.component;

          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col lg:flex-row gap-8 items-start lg:items-center animate-fade-in">
              
              {/* 1. Miniatura del Diseño */}
              <div className="w-full lg:w-48 bg-gray-50 rounded-lg p-4 border border-gray-100 flex-shrink-0">
                <div className="relative w-full aspect-[2/3] drop-shadow-md">
                  <CaseGraphic 
                    color={order.designData.hex}
                    initials={order.designData.iniciales}
                    IconComponent={OrderIcon}
                    detailsColor={order.designData.detailsColor}
                    baseImage={order.designData.baseImage}
                    textureImage={order.designData.textureImage}
                    textSize="text-lg md:text-xl"
                    iconSize={18}
                  />
                </div>
              </div>

              {/* 2. Detalles de la Orden y Cliente */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                
                {/* Info del Pedido */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{order.id}</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Realizada el {order.date}</p>
                  
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Detalles del Diseño</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><span className="font-medium">Modelo:</span> {order.designData.modelo}</li>
                    <li><span className="font-medium">Color:</span> {order.designData.colorBase}</li>
                    <li><span className="font-medium">Iniciales:</span> {order.designData.iniciales}</li>
                    <li><span className="font-medium">Detalles:</span> {order.designData.colorLetras}</li>
                  </ul>
                </div>

                {/* Info de Envío (BM Cargo) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Datos de Envío</h3>
                  <p className="text-base font-bold text-gray-900 mb-1">{order.customer.nombre} {order.customer.apellido}</p>
                  <p className="text-sm text-gray-600 mb-1">📞 {order.customer.telefono}</p>
                  <p className="text-sm text-gray-600 mb-3">✉️ {order.customer.correo}</p>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm">
                      <span className="font-bold text-blue-800">BM Cargo:</span> Sucursal {order.customer.sucursalBM}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}