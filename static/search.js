// Función para manejar el carrusel
      function startCarousel() {
      const items = document.querySelectorAll('.carousel-item');
      let currentIndex = 0;

      setInterval(() => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
      }, 10000); // Cambiar cada 8 segundos
    }

    // Llamar al carrusel al cargar la página
    window.onload = startCarousel;

    async function fetchNote() {
      const form = document.getElementById('searchForm');
      form.classList.add('hidden'); // Ocultar el formulario

      const name = document.getElementById('searchNoteName').value;
      const password = document.getElementById('searchPassword').value;

      const response = await fetch(`/get-note/${name}`);
      const result = await response.json();

      if (result.error) {
        document.getElementById('noteResult').innerText = result.error;
        form.classList.remove('hidden'); // Mostrar el formulario si hay error
        return;
      }

      try {
        const decryptedContent = CryptoJS.AES.decrypt(result.content, password).toString(CryptoJS.enc.Utf8);
        if (!decryptedContent) {
          throw new Error("La contraseña es incorrecta o los datos están corruptos.");
    }
    // Limpiar resultado anterior
const noteResult = document.getElementById('noteResult');
noteResult.innerHTML = ''; // Limpiar el contenido

// Crear canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');


// Estilos del texto
const maxWidth = Math.min(window.innerWidth * 0.9, 600);
const fontSize = Math.max(14, Math.floor(maxWidth / 30));
const lineHeight = fontSize * 1.5;
ctx.font = `${fontSize}px Courier New`;
const padding = 20;

// Dividir texto en líneas
const rawLines = decryptedContent.split('\n');
const lines = [];

rawLines.forEach((line) => {
  let currentLine = '';
  const words = line.split(' ');

  words.forEach(word => {
    const testLine = currentLine + word + ' ';
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth - padding * 2) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
});


// Ajustar tamaño del canvas
canvas.width = maxWidth;
canvas.height = padding * 2 + lines.length * lineHeight;

// Fondo blanco
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Dibujar texto principal
ctx.fillStyle = '#000';
ctx.font = `${fontSize}px Arial`;
ctx.textBaseline = 'top';

lines.forEach((line, index) => {
  ctx.fillText(line, padding, padding + index * lineHeight);
});

ctx.save();
ctx.globalAlpha = 0.6;
ctx.translate(canvas.width / 6, canvas.height / 6);
ctx.rotate(-Math.PI / 6);
ctx.font = `${fontSize + 5}px sans-serif`;
ctx.fillStyle = '#000';
ctx.textAlign = 'center';

const watermarkText = `NotMave - ${new Date().toLocaleString()}`;
const stepX = maxWidth / 1.1;
const stepY = lineHeight * 1;

// Dibujar el texto en patrón repetido
for (let y = -canvas.height; y < canvas.height * 4; y += stepY) {
  for (let x = -canvas.width; x < canvas.width * 4; x += stepX) {
    ctx.fillText(watermarkText, x, y);
  }
}

ctx.restore();

noteResult.appendChild(canvas);
noteResult.classList.add('unselectable', 'note-content');

// Bloquear interacciones
noteResult.oncopy = noteResult.oncut = noteResult.onpaste = noteResult.oncontextmenu = (e) => {
  e.preventDefault();
  return false;
}
  } catch (e) {
    document.getElementById('noteResult').innerText = e.message;
    form.classList.remove('hidden'); // Mostrar el formulario si hay error
  }

  document.getElementById('backButton').classList.remove('hidden'); // Mostrar el botón de regresar
}


  // Función para obtener el precio de Bitcoin
  async function getBitcoinPrice() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        return data.bitcoin.usd;
      } catch (error) {
        console.error("Error al obtener el precio de Bitcoin:", error);
        return "N/A";
      }
    }

    // Función para obtener el volumen de transacciones de Bitcoin
    async function getBitcoinVolume() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
        const data = await response.json();
        return data.market_data.total_volume.usd.toLocaleString();
      } catch (error) {
        console.error("Error al obtener el volumen de transacciones:", error);
        return "N/A";
      }
    }

    // Función para obtener el tamaño de la mempool
    async function getMempoolSize() {
      try {
        const response = await fetch('https://mempool.space/api/mempool');
        const data = await response.json();
        const mempoolSizeBytes = data.size; // Tamaño en bytes
        const mempoolSizeMB = (mempoolSizeBytes / (1024 * 1024)).toFixed(2); // Convertir a MB
        return `${mempoolSizeMB} MB`;
      } catch (error) {
        console.error("Error al obtener el tamaño de la mempool:", error);
        return "N/A";
      }
    }

    // Función para obtener el hashrate de la red
    async function getNetworkHashrate() {
      try {
        const response = await fetch('https://mempool.space/api/v1/mining/hashrate/3d');
        const data = await response.json();
        const hashrateEH = (data.currentHashrate / 1e18).toFixed(2); // Convertir a EH/s
        return `${hashrateEH} EH/s`;
      } catch (error) {
        console.error("Error al obtener el hashrate de la red:", error);
        return "N/A";
      }
    }

    async function updateBitcoinData() {
      const price = await getBitcoinPrice();
      const volume = await getBitcoinVolume();
      const mempoolSize = await getMempoolSize();
      const hashrate = await getNetworkHashrate();

      const btcPriceSlide = document.getElementById('btcPriceSlide');
      const btcVolumeSlide = document.getElementById('btcVolumeSlide');
      const btcMempoolSlide = document.getElementById('btcMempoolSlide');
      const btcHashrateSlide = document.getElementById('btcHashrateSlide');

      if (btcPriceSlide) {
        btcPriceSlide.innerHTML = `💲 Precio de Bitcoin: $${price} USD`;
      }

      if (btcVolumeSlide) {
        btcVolumeSlide.innerHTML = `📊 Volumen de transacciones (24h): $${volume} USD`;
      }

      if (btcMempoolSlide) {
        btcMempoolSlide.innerHTML = `📦 Tamaño de la mempool: ${mempoolSize}`;
      }

      if (btcHashrateSlide) {
        btcHashrateSlide.innerHTML = `⚡ Hashrate de la red: ${hashrate}`;
      }
    }

    // Llamar al carrusel y actualizar los datos de Bitcoin al cargar la página
    window.onload = () => {
      startCarousel();
      updateBitcoinData();
      setInterval(updateBitcoinData, 60000); // Actualizar cada minuto
    };


    function goBack() {
      const form = document.getElementById('searchForm');
      const result = document.getElementById('noteResult');
      const backButton = document.getElementById('backButton');

      // Limpia el contenido del resultado
      result.textContent = '';

      // Vuelve a mostrar el formulario
      form.classList.remove('hidden');

      // Oculta el botón de regresar
      backButton.classList.add('hidden');
    }

    // Protección visual contra screenshots o pérdida de foco

// Capa de oscurecimiento
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = 'black';
overlay.style.zIndex = '9999';
overlay.style.display = 'none';
document.body.appendChild(overlay);

// Detectar pérdida de foco (cambio de pestaña o app)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    overlay.style.display = 'block';
  } else {
    overlay.style.display = 'none';
  }
});

// También cubrir si cambia de ventana
window.addEventListener('blur', () => {
  overlay.style.display = 'block';
});
window.addEventListener('focus', () => {
  overlay.style.display = 'none';
});
