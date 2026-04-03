// Ya no importamos las imágenes aquí arriba, las recibimos como "props"

const CaseGraphic = ({ 
  color, 
  isMini = false, 
  initials = '', 
  IconComponent = null, 
  detailsColor = '#D4AF37',
  baseImage,     // NUEVA PROPIEDAD
  textureImage   // NUEVA PROPIEDAD
}) => {
  return (
    <div className="relative w-full flex items-center justify-center">
      
      {/* CAPA 1: La Base (Ahora usa la imagen dinámica) */}
      <img
        src={baseImage}
        alt="Forro Base"
        className="block w-full h-auto object-contain"
      />

      {/* CAPA 2: El Color de la Textura (Ahora usa la textura dinámica) */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url(${textureImage})`,
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          maskImage: `url(${textureImage})`,
          maskSize: 'contain',
          maskPosition: 'center',
          maskRepeat: 'no-repeat',
          mixBlendMode: 'multiply' 
        }}
      />

      {/* CAPA 3: Los Detalles */}
      {!isMini && (
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {/* Iniciales */}
          <div
            className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-3xl md:text-4xl tracking-widest"
            style={{
              color: detailsColor,
              textShadow: '0 0 3px rgba(255,255,255,0.5)' 
            }}
          >
            {initials}
          </div>
          
          {/* Icono Vectorial */}
          {IconComponent && (
            <div
              className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
              style={{
                color: detailsColor,
                filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4))'
              }}
            >
              <IconComponent size={30} weight="fill" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseGraphic;