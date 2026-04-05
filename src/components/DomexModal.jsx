import React from 'react';

export default function DomexModal({
  selectedRegion,
  searchTerm,
  setSearchTerm,
  setIsModalOpen,
  chunkedBranches,
  handleSelectBranch,
  selectedBranch,
  formatBranchName
}) {
  return (
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
  );
}