import React from 'react';

export default function LocationModal({
  setShowLocationModal,
  closestBranches,
  handleSelectBranch,
  formatBranchName
}) {
  return (
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
  );
}