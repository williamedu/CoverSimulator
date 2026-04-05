import puppeteer from 'puppeteer';
import fs from 'fs';

const rutasAExplorar = [
  { url: 'https://www.domex.do/santodomingo', region: 'Santo Domingo' },
  { url: 'https://www.domex.do/region-este', region: 'Región Este' },
  { url: 'https://www.domex.do/region-norte', region: 'Región Norte' },
  { url: 'https://www.domex.do/region-sur', region: 'Región Sur' }
];

async function extraccionNacional() {
  console.log('🚀 INICIANDO EXTRACCIÓN A NIVEL NACIONAL...\n');
  const sucursalesNacionales = []; 

  try {
    const browser = await puppeteer.launch({ headless: "new" });

    for (const ruta of rutasAExplorar) {
      console.log(`\n==================================================`);
      console.log(`📍 Explorando: ${ruta.region} -> ${ruta.url}`);
      console.log(`==================================================`);
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      try {
        await page.goto(ruta.url, { waitUntil: 'networkidle2' });
        
        console.log('1️⃣ Haciendo Scroll profundo (10-15 segs)...');
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 300;
            let timer = setInterval(() => {
              let scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight - window.innerHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 400); 
          });
        });

        console.log('2️⃣ Extrayendo Textos y Alturas con lectura flexible...');
        await new Promise(r => setTimeout(r, 2000)); 

        const bloquesTexto = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('div[data-testid="richTextElement"]'))
            .map(el => {
              const textoCompleto = el.innerText.trim();
              const rect = el.getBoundingClientRect();
              return { textoCompleto, y: rect.top + window.scrollY };
            })
            // FILTRO RELAJADO: Si tiene arroba o la palabra Tel/Cel, o números de teléfono, lo agarramos
            .filter(item => item.textoCompleto.includes('@') || item.textoCompleto.match(/\d{3}-\d{3}-\d{4}/));
        });

        console.log(`   -> Textos de sucursales encontrados: ${bloquesTexto.length}`);
        console.log('3️⃣ Hackeando los frames ocultos para sacar mapas...');

        const mapasEncontrados = [];
        for (const frame of page.frames()) {
          const frameUrl = frame.url();
          if (frameUrl.includes('google') && (frameUrl.includes('!2d') || frameUrl.includes('ll='))) {
            const matchRegex = frameUrl.match(/!3d(-?\d+\.\d+).*?!2d(-?\d+\.\d+)/) || 
                               frameUrl.match(/!2d(-?\d+\.\d+).*?!3d(-?\d+\.\d+)/) ||
                               frameUrl.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
                               
            if (matchRegex) {
              const num1 = parseFloat(matchRegex[1]);
              const num2 = parseFloat(matchRegex[2]);
              const lat = Math.abs(num1) < 25 ? num1 : num2; 
              const lng = Math.abs(num1) > 60 ? num1 : num2; 

              let alturaY = 0;
              try {
                let currentFrame = frame;
                let parent = currentFrame.parentFrame();
                while (parent && parent !== page.mainFrame()) {
                  currentFrame = parent;
                  parent = currentFrame.parentFrame();
                }
                const frameHandle = await currentFrame.frameElement();
                if (frameHandle) {
                  alturaY = await frameHandle.evaluate(el => el.getBoundingClientRect().top + window.scrollY);
                }
              } catch (e) {}

              if (alturaY > 0) {
                mapasEncontrados.push({ lat, lng, y: alturaY });
              }
            }
          }
        }

        console.log(`   -> Mapas interceptados: ${mapasEncontrados.length}`);
        console.log('4️⃣ Emparejando y guardando datos...');

        // NUEVO PARSEO DE TEXTO (Súper flexible a errores humanos)
        bloquesTexto.forEach(bloque => {
          const texto = bloque.textoCompleto;
          
          // Dividimos todo el texto en líneas separadas
          const lineas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);

          // Asumimos que la primera línea SIEMPRE es el nombre de la sucursal
          const nombre = lineas[0] || 'Sucursal Desconocida';

          // Buscamos el teléfono con formato X-X-X
          const matchTel = texto.match(/([\d]{3}-[\d]{3}-[\d]{4})/);
          const telefono = matchTel ? matchTel[0] : 'Teléfono no publicado';

          // Buscamos el correo con el arroba
          const matchEmail = texto.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})/);
          const correo = matchEmail ? matchEmail[0] : 'Correo no publicado';
          
          // La dirección suele estar en la línea 2 (y a veces la 3)
          let direccion = lineas.length > 1 ? lineas[1] : 'Ver dirección en el mapa';
          if (lineas.length > 2 && !lineas[2].includes('@') && !lineas[2].match(/\d{3}-\d{3}-\d{4}/)) {
             direccion += ', ' + lineas[2]; // Unimos línea 2 y 3 si no son teléfonos ni correos
          }

          let mapaMasCercano = null;
          let menorDiferencia = Infinity;

          mapasEncontrados.forEach(mapa => {
            const diferencia = Math.abs(mapa.y - bloque.y);
            if (diferencia < menorDiferencia && diferencia < 450) { // Amplié el margen de búsqueda a 450px
              menorDiferencia = diferencia;
              mapaMasCercano = mapa;
            }
          });

          sucursalesNacionales.push({
            region: ruta.region,
            nombre,
            direccion,
            telefono,
            correo,
            coordenadas: mapaMasCercano ? { lat: mapaMasCercano.lat, lng: mapaMasCercano.lng } : null
          });
        });

      } catch (err) {
        console.error(`❌ Error explorando ${ruta.region}:`, err.message);
      } finally {
        await page.close();
      }
    }

    await browser.close();

    console.log('\n✅ ¡MISIÓN CUMPLIDA! EXTRACCIÓN NACIONAL FINALIZADA.');
    console.log(`🎯 Total de sucursales extraídas en todo el país: ${sucursalesNacionales.length}\n`);
    
    fs.writeFileSync('domex_sucursales_nacional.json', JSON.stringify(sucursalesNacionales, null, 2));
    console.log('💾 Todo guardado en "domex_sucursales_nacional.json".');

  } catch (error) {
    console.error('❌ Error fatal en el navegador:', error.message);
  }
}

extraccionNacional();