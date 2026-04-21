// Referencias a elementos existentes
const audio = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = playPauseBtn.querySelector('i');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const volumeSlider = document.getElementById('volumeSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// NUEVAS Referencias para cambiar la info de la canción
const tituloEl = document.getElementById('titulo-cancion');
const artistaEl = document.getElementById('artista-cancion');
const coverEl = document.getElementById('cover-cancion');
const bgCoverEl = document.getElementById('bg-cover');

// --- LISTA DE REPRODUCCIÓN ---
// IMPORTANTE: Asegúrate de que las rutas (src) y portadas (cover) 
// coincidan exactamente con los nombres de tus archivos en la carpeta static
const playlist = [
    {
        titulo: "Bohemian Rhapsody",
        artista: "Queen",
        src: "/audio/Bohemian Rhapsody.mp3",
        cover: "/images/Bohemian Rhapsody.jpg" // Cambia esto por el nombre real de tu imagen
    },
    {
        titulo: "AM Remix",
        artista: "Nio Garcia",
        src: "/audio/AM Remix.mp3",
        cover: "/images/Volví.jpg" // Vi esta imagen en tus carpetas antes
    },
    {
        titulo: "Dakiti",
        artista: "Bad Bunny",
        src: "/audio/Dakiti.mp3",
        cover: "/images/Dakiti.jpg" // Agrega las portadas correspondientes
    }
];

let indiceActual = 0; // Para saber qué canción está sonando

// Configurar volumen inicial
audio.volume = 0.7;

// --- FUNCIONES NUEVAS ---
// Función principal para cargar y reproducir una nueva canción
function cargarCancion(indice) {
    const cancion = playlist[indice];
    
    // 1. Cambiar textos e imágenes
    tituloEl.textContent = cancion.titulo;
    artistaEl.textContent = cancion.artista;
    coverEl.src = cancion.cover;
    bgCoverEl.style.backgroundImage = `url('${cancion.cover}')`; // Cambia el fondo difuminado
    
    // 2. Cambiar el audio
    audio.src = cancion.src;
    
    // 3. Reproducir automáticamente
    audio.play().then(() => {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    }).catch(error => {
        console.log('Error al reproducir:', error);
    });
}

// Botón Siguiente
nextBtn.addEventListener('click', () => {
    indiceActual++;
    // Si llegamos al final, volvemos a la primera (0)
    if (indiceActual >= playlist.length) {
        indiceActual = 0;
    }
    cargarCancion(indiceActual);
});

// Botón Anterior
prevBtn.addEventListener('click', () => {
    // Si la canción lleva más de 3 segundos, reiniciar la misma canción (como en Spotify)
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        audio.play();
        return;
    }

    indiceActual--;
    // Si estamos en la primera y retrocedemos, vamos a la última
    if (indiceActual < 0) {
        indiceActual = playlist.length - 1;
    }
    cargarCancion(indiceActual);
});

// Pasar a la siguiente canción automáticamente cuando termine la actual
audio.addEventListener('ended', () => {
    nextBtn.click(); // Simula un clic en el botón siguiente
});


// --- TU CÓDIGO ORIGINAL (Eventos del reproductor) ---

// Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    } else {
        audio.pause();
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }
});

// Actualizar tiempo y barra de progreso
audio.addEventListener('timeupdate', () => {
    // Solo actualizar si hay una duración válida (evita errores de NaN)
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = progress + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

// Mostrar duración cuando se carga el archivo de audio
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// Hacer clic en la barra de progreso
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

// Control de volumen
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Formatear tiempo
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Auto-reproducir al cargar (Tu código original)
window.addEventListener('load', () => {
    audio.play().then(() => {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    }).catch(error => {
        console.log('Auto-play bloqueado por el navegador:', error);
    });
});

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playPauseBtn.click();
    }
    if (e.code === 'ArrowLeft') {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
    }
    if (e.code === 'ArrowRight') {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    }
});