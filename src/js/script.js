document.addEventListener('DOMContentLoaded', function () {
    const pageFlip = new St.PageFlip(document.getElementById('book'), {
        width: 600,
        height: 800,
        size: 'stretch',
        minWidth: 1,
        maxWidth: 600,
        minHeight: 1,
        maxHeight: 800,
        drawShadow: true,
        maxShadowOpacity: 0.8,
        showCover: true,
        usePortrait: false,
        flippingTime: 1000
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    pageFlip.on('flip', (e) => {
        if (ambienteIniciado) {
            audioPagina.src = SONIDO_PAGINA;
            audioPagina.volume = 1;
            audioPagina.currentTime = 0;
            audioPagina.play().catch((err) => console.log('Error al sonar página:', err));
        }
    });
});

const LINK_AMBIENTE = './assets/audio/base.mp3';
const EFECTOS_ALTERNOS = ['./assets/audio/demon.mp3', './assets/audio/vampiro.mp3'];
const GRITOS = ['./assets/audio/grito.mp3', './assets/audio/grito_hombre.mp3'];
const SONIDO_PAGINA = './assets/audio/pagina.mp3';

const TIEMPO_MIN = 8000; // Subido a 8 seg para dar margen a que termine el audio anterior
const TIEMPO_MAX = 15000; // Ajustado a 45 seg

const audioAmbiente = document.getElementById('audio-ambiente');
const audioEfecto = document.getElementById('audio-efecto');
const audioPagina = document.getElementById('sonido-pagina');
const audioGritos = document.getElementById('audio-gritos');
const activarSonido = document.querySelector('.escenario-mesa');
const libro = document.querySelector('.libro-inclinado');

let temporizadorEfectos;
let ambienteIniciado = false; // Banderazo para evitar que se duplique o reinicie el bucle

function programarSiguienteEfecto() {
    clearTimeout(temporizadorEfectos);

    const tiempoAleatorio = Math.floor(Math.random() * (TIEMPO_MAX - TIEMPO_MIN + 1)) + TIEMPO_MIN;
    const tiempoGritos = Math.floor(Math.random() * (TIEMPO_MAX - TIEMPO_MIN + 1)) + TIEMPO_MIN;

    temporizadorEfectos = setTimeout(() => {
        // Escoger efecto
        const indiceAleatorio = Math.floor(Math.random() * EFECTOS_ALTERNOS.length);

        audioEfecto.src = EFECTOS_ALTERNOS[indiceAleatorio];
        audioEfecto.volume = 0.6;
        audioEfecto.play().catch((e) => console.log('Error al reproducir efecto:', e));

        audioEfecto.onended = () => {
            programarSiguienteEfecto();
        };
    }, tiempoAleatorio);

    gritos = setTimeout(() => {
        const indiceGrito = Math.floor(Math.random() * GRITOS.length);
        audioGritos.src = GRITOS[indiceGrito];
        audioGritos.volume = 1;
        audioGritos.play().catch((e) => console.log('Error al reproducir efecto:', e));
    }, tiempoGritos);
}

// Revisar la vibración

let temporizadorVibracion;

function addEfecto() {
  clearTimeout(temporizadorVibracion);

  const tiempoAleatorio = Math.floor(Math.random() * (TIEMPO_MAX - TIEMPO_MIN + 1)) + TIEMPO_MIN;

  temporizadorVibracion = setTimeout(() => {
    libro.classList.add('vibracion');

    setTimeout(() => {
      libro.classList.remove('vibracion');
    }, 600);

    addEfecto();

  }, tiempoAleatorio);
}

activarSonido.addEventListener('click', () => {
    if (ambienteIniciado) return;

    ambienteIniciado = true;
    audioAmbiente.src = LINK_AMBIENTE;
    audioAmbiente.volume = 0.4;
    audioAmbiente.play().catch((e) => console.log('Error en ambiente:', e));

    programarSiguienteEfecto();
});

addEfecto();