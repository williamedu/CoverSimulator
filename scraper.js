import puppeteer from 'puppeteer';
import fs from 'fs';

const url = 'https://www.domex.do/santodomingo';

async function laFusionDefinitiva() {
  console.log(`Iniciando La Fusión Definitiva en: ${url}...\n`);

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    console.log('1️⃣ Haciendo Scroll profundo para despertar a Wix (10-15 segs)...');

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

    console.log('2️⃣ Scroll terminado. Extrayendo los Textos...');
    await new Promise(r => setTimeout(r, 2000)); 

    // --- PARTE 1: EXTRAER TEXTOS Y SU ALTURA (Y) ---
    const bloquesTexto = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div[data-testid="richTextElement"]'))
        .map(el => {
          const textoCompleto = el.innerText.trim();
          const rect = el.getBoundingClientRect();
          return { textoCompleto, y: rect.top + window.scrollY };
        })
        .filter(item => item.textoCompleto.includes('DO.') && item.textoCompleto.includes('Tel.'));
    });

    console.log(`   -> Textos encontrados: ${bloquesTexto.length}`);
    console.log('3️⃣ Hackeando las muñecas rusas para sacar mapas y su altura...');

    // --- PARTE 2: EXTRAER MAPAS DE LOS FRAMES OCULTOS Y SU ALTURA (Y) ---
    const mapasEncontrados = [];
    
    for (const frame of page.frames()) {
      const frameUrl = frame.url();
      
      // Si el frame escondido es de Google Maps
      if (frameUrl.includes('google') && (frameUrl.includes('!2d') || frameUrl.includes('ll='))) {
        
        // Sacamos las coordenadas usando nuestra vieja confiable Regex
        const matchRegex = frameUrl.match(/!3d(-?\d+\.\d+).*?!2d(-?\d+\.\d+)/) || 
                           frameUrl.match(/!2d(-?\d+\.\d+).*?!3d(-?\d+\.\d+)/) ||
                           frameUrl.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
                           
        if (matchRegex) {
          const num1 = parseFloat(matchRegex[1]);
          const num2 = parseFloat(matchRegex[2]);
          const lat = Math.abs(num1) < 25 ? num1 : num2; 
          const lng = Math.abs(num1) > 60 ? num1 : num2; 

          // EL TRUCO MAGISTRAL: Buscamos qué tan abajo en la página está este mapa
          let alturaY = 0;
          try {
            // Caminamos hacia "arriba" desde la muñeca pequeña hasta la caja principal
            let currentFrame = frame;
            let parent = currentFrame.parentFrame();
            
            while (parent && parent !== page.mainFrame()) {
              currentFrame = parent;
              parent = currentFrame.parentFrame();
            }
            
            // Obtenemos el elemento de la página principal
            const frameHandle = await currentFrame.frameElement();
            if (frameHandle) {
              alturaY = await frameHandle.evaluate(el => el.getBoundingClientRect().top + window.scrollY);
            }
          } catch (e) {
            // Ignoramos errores si el frame se mueve o desaparece
          }

          if (alturaY > 0) {
            mapasEncontrados.push({ lat, lng, y: alturaY });
          }
        }
      }
    }

    console.log(`   -> Mapas interceptados: ${mapasEncontrados.length}`);
    console.log('4️⃣ Emparejando Textos con Mapas mediante Inteligencia Visual...');

    // --- PARTE 3: EMPAREJARLOS EN NODE.JS ---
    const sucursalesFinales = bloquesTexto.map(bloque => {
      // Parsear datos
      const matchNombre = bloque.textoCompleto.match(/(DO\.[^\n]+)/);
      const matchTel = bloque.textoCompleto.match(/(Tel\.\s*[\d-]+)/);
      const matchEmail = bloque.textoCompleto.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})/);
      
      const nombre = matchNombre ? matchNombre[1].trim() : 'Nombre no encontrado';
      const telefono = matchTel ? matchTel[1].trim() : 'Tel no encontrado';
      const correo = matchEmail ? matchEmail[1].trim() : 'Correo no encontrado';
      
      let direccion = 'Dirección no encontrada';
      if (matchNombre && matchTel) {
        const startIndex = bloque.textoCompleto.indexOf(matchNombre[1]) + matchNombre[1].length;
        const endIndex = bloque.textoCompleto.indexOf(matchTel[1]);
        direccion = bloque.textoCompleto.substring(startIndex, endIndex).trim().replace(/^\n+|\n+$/g, '');
      }

      // Buscar el mapa más cercano (emparejamiento visual)
      let mapaMasCercano = null;
      let menorDiferencia = Infinity;

      mapasEncontrados.forEach(mapa => {
        const diferencia = Math.abs(mapa.y - bloque.y);
        // Si la distancia visual es menor a 400 pixeles, pertenecen a la misma sucursal
        if (diferencia < menorDiferencia && diferencia < 400) {
          menorDiferencia = diferencia;
          mapaMasCercano = mapa;
        }
      });

      return {
        nombre,
        direccion,
        telefono,
        correo,
        coordenadas: mapaMasCercano ? { lat: mapaMasCercano.lat, lng: mapaMasCercano.lng } : null
      };
    });

    await browser.close();

    console.log('\n✅ ¡EXTRACCIÓN TOTAL Y PERFECTA COMPLETADA!');
    console.log(`🎯 Su base de datos está lista, jefe:\n`);
    console.log(JSON.stringify(sucursalesFinales, null, 2));

    fs.writeFileSync('domex_sucursales_final.json', JSON.stringify(sucursalesFinales, null, 2));
    console.log('\n💾 Guardado en "domex_sucursales_final.json". ¡Es hora de ir a React!');

  } catch (error) {
    console.error('❌ Error fatal:', error.message);
  }
}

laFusionDefinitiva();