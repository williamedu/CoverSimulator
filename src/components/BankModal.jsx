import React from 'react';

export default function BankModal({ orderId, linkWhatsApp }) {
  return (
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
  );
}