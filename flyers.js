// ============================================================
// GENERADOR DE FLYERS Y PUBLICACIONES — Dropea (cuenta oficial de Instagram)
// Mismo lenguaje visual que qr-cards.js: negro de marca, un color de acento,
// destellos de 4 puntas, títulos en mayúscula cursiva, sombra dura, puntos
// de serigrafía y marco "visor de cámara" para el QR.
//
// Depende de (cargadas en flyers.html):
//   - QRCode      (cdn "qrcodejs")      -> solo si activás el QR
//   - htmlToImage (cdn "html-to-image") -> para descargar el PNG
//   - dropea-logo.png en la misma carpeta (si no está, se usa el texto "Dropea")
//
// Todo lo que se puede editar del contenido vive en `estado`. Para agregar
// una plantilla nueva: sumala a PLANTILLAS y a CONSTRUCTORES.
// ============================================================

// ------------------------------------------------------------
// FORMATOS (tamaño de diseño en px; se exporta a 1080 px de ancho)
// ------------------------------------------------------------
const ANCHO_SALIDA = 1080;
const FORMATOS = {
    cuadrado: { label: 'Post cuadrado',  sub: '1080 × 1080 · feed',      ancho: 540, alto: 540, qrTam: 100, archivo: 'post-cuadrado' },
    vertical: { label: 'Post vertical',  sub: '1080 × 1350 · feed 4:5',  ancho: 432, alto: 540, qrTam: 116, archivo: 'post-vertical' },
    historia: { label: 'Historia',       sub: '1080 × 1920 · Stories',   ancho: 405, alto: 720, qrTam: 136, archivo: 'historia' },
};

const PLANTILLAS = {
    claro:  { label: 'Claro',  sub: 'Fondo de color y tarjeta blanca' },
    oscuro: { label: 'Oscuro', sub: 'Fondo negro con brillo' },
    oferta: { label: 'Oferta', sub: 'Número o precio gigante' },
    foto:   { label: 'Foto',   sub: 'Con una imagen tuya' },
};

// ------------------------------------------------------------
// PALETAS Y TIPOGRAFÍAS (las mismas que las tarjetas QR)
// ------------------------------------------------------------
const NEGRO_DROPEA = '#09090b';
const RUTA_LOGO_DROPEA = 'dropea-logo.png';

const PALETAS = {
    amarillo:   { label: 'Amarillo',    acento: '#facc15' },
    lima:       { label: 'Lima',        acento: '#a3e635' },
    verde:      { label: 'Verde',       acento: '#4ade80' },
    esmeralda:  { label: 'Esmeralda',   acento: '#34d399' },
    menta:      { label: 'Menta',       acento: '#5eead4' },
    turquesa:   { label: 'Turquesa',    acento: '#2dd4bf' },
    cyan:       { label: 'Cian',        acento: '#22d3ee' },
    celeste:    { label: 'Celeste',     acento: '#38bdf8' },
    azul:       { label: 'Azul',        acento: '#60a5fa' },
    azul_oceano:{ label: 'Azul océano', acento: '#3b82f6' },
    azul_real:  { label: 'Azul real',   acento: '#2563eb' },
    azul_noche: { label: 'Azul noche',  acento: '#1e40af' },
    indigo:     { label: 'Índigo',      acento: '#818cf8' },
    lavanda:    { label: 'Lavanda',     acento: '#c4b5fd' },
    violeta:    { label: 'Violeta',     acento: '#a78bfa' },
    morado:     { label: 'Morado',      acento: '#c084fc' },
    uva:        { label: 'Uva',         acento: '#9333ea' },
    fucsia:     { label: 'Fucsia',      acento: '#e879f9' },
    magenta:    { label: 'Magenta',     acento: '#d946ef' },
    rosa:       { label: 'Rosa',        acento: '#f472b6' },
    rosa_pastel:{ label: 'Rosa pastel', acento: '#f9a8d4' },
    frambuesa:  { label: 'Frambuesa',   acento: '#e11d48' },
    coral:      { label: 'Coral',       acento: '#fb7185' },
    rojo:       { label: 'Rojo',        acento: '#ef4444' },
    rojo_oscuro:{ label: 'Rojo oscuro', acento: '#b91c1c' },
    bordo:      { label: 'Bordó',       acento: '#9f1239' },
    naranja:    { label: 'Naranja',     acento: '#fb923c' },
    mandarina:  { label: 'Mandarina',   acento: '#f97316' },
    durazno:    { label: 'Durazno',     acento: '#fdba74' },
    terracota:  { label: 'Terracota',   acento: '#c2410c' },
    dorado:     { label: 'Dorado',      acento: '#fbbf24' },
    mostaza:    { label: 'Mostaza',     acento: '#eab308' },
    beige:      { label: 'Beige',       acento: '#d6b98c' },
    marron:     { label: 'Marrón',      acento: '#a16207' },
    chocolate:  { label: 'Chocolate',   acento: '#78350f' },
    blanco:     { label: 'Blanco y negro', acento: '#f4f4f5' },
    plata:      { label: 'Plata',       acento: '#d4d4d8' },
    gris:       { label: 'Gris',        acento: '#a1a1aa' },
    grafito:    { label: 'Grafito',     acento: '#52525b' },
    negro:      { label: 'Negro',       acento: '#18181b' },
};

// gf = especificación para Google Fonts (cada familia se pide por separado
// para que un nombre mal escrito no rompa a las demás).
const FUENTES = {
    jakarta:   { label: 'Moderna',       family: "'Plus Jakarta Sans', sans-serif", gf: 'Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800' },
    poppins:   { label: 'Redondeada',    family: "'Poppins', sans-serif",           gf: 'Poppins:wght@400;600;800' },
    montserrat:{ label: 'Geométrica',    family: "'Montserrat', sans-serif",        gf: 'Montserrat:wght@400..800' },
    inter:     { label: 'Minimalista',   family: "'Inter', sans-serif",             gf: 'Inter:wght@400..800' },
    roboto:    { label: 'Neutra',        family: "'Roboto', sans-serif",            gf: 'Roboto:wght@400..800' },
    nunito:    { label: 'Amigable',      family: "'Nunito', sans-serif",            gf: 'Nunito:wght@400..800' },
    outfit:    { label: 'Contemporánea', family: "'Outfit', sans-serif",            gf: 'Outfit:wght@400..800' },
    raleway:   { label: 'Fina',          family: "'Raleway', sans-serif",           gf: 'Raleway:wght@400..800' },
    oswald:    { label: 'Estrecha',      family: "'Oswald', sans-serif",            gf: 'Oswald:wght@400;700', condensada: true },
    bebas:     { label: 'Potente',       family: "'Bebas Neue', sans-serif",        gf: 'Bebas+Neue',          condensada: true },
    anton:     { label: 'Impacto',       family: "'Anton', sans-serif",             gf: 'Anton',               condensada: true },
    archivo:   { label: 'Profesional',   family: "'Archivo', sans-serif",           gf: 'Archivo:wght@400..800' },
    barlow:    { label: 'Tecnológica',   family: "'Barlow', sans-serif",            gf: 'Barlow:wght@400;600;800' },
    space:     { label: 'Futurista',     family: "'Space Grotesk', sans-serif",     gf: 'Space+Grotesk:wght@400;700' },
    orbitron:  { label: 'Digital',       family: "'Orbitron', sans-serif",          gf: 'Orbitron:wght@400..800' },
    playfair:  { label: 'Elegante',      family: "'Playfair Display', serif",       gf: 'Playfair+Display:wght@400..800' },
    cormorant: { label: 'Sofisticada',   family: "'Cormorant Garamond', serif",     gf: 'Cormorant+Garamond:wght@400;700' },
    lora:      { label: 'Editorial',     family: "'Lora', serif",                   gf: 'Lora:wght@400;700' },
    merriweather:{ label: 'Tradicional', family: "'Merriweather', serif",           gf: 'Merriweather:wght@400;700' },
    libre:     { label: 'Serif clásica', family: "'Libre Baskerville', serif",      gf: 'Libre+Baskerville:wght@400;700' },
    dancing:   { label: 'Manuscrita',    family: "'Dancing Script', cursive",       gf: 'Dancing+Script:wght@400;700' },
    greatvibes:{ label: 'Caligráfica',   family: "'Great Vibes', cursive",          gf: 'Great+Vibes' },
    pacifico:  { label: 'Casual',        family: "'Pacifico', cursive",             gf: 'Pacifico' },
    lobster:   { label: 'Decorativa',    family: "'Lobster', cursive",              gf: 'Lobster' },
    caveat:    { label: 'Escrita',       family: "'Caveat', cursive",               gf: 'Caveat:wght@400;700' },
};

function cargarGoogleFonts() {
    Object.values(FUENTES).forEach(f => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${f.gf}&display=swap`;
        document.head.appendChild(link);
    });
}

// ------------------------------------------------------------
// ESTADO (se guarda solo en el navegador para no perder el trabajo)
// ------------------------------------------------------------
const CLAVE_LS = 'dropea_flyers_estado_v1';
const ESTADO_INICIAL = {
    formato: 'cuadrado',
    plantilla: 'claro',
    paleta: 'amarillo',
    fuente: 'jakarta',
    etiqueta: 'Novedad',
    titulo: '¡Ya tenemos\n*catálogo\nonline!',
    texto: 'Mirá los productos de emprendedores y pedí en un toque.',
    destacado: '30% OFF',
    cta: 'Conocé más',
    pie: 'dropea.com.ar',
    qrActivo: false,
    qrLink: 'https://dropea.com.ar',
    imagen: '',
};

let estado = cargarEstado();

function cargarEstado() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_LS) || 'null');
        if (guardado && typeof guardado === 'object') {
            const e = { ...ESTADO_INICIAL, ...guardado };
            if (!FORMATOS[e.formato]) e.formato = ESTADO_INICIAL.formato;
            if (!PLANTILLAS[e.plantilla]) e.plantilla = ESTADO_INICIAL.plantilla;
            if (!PALETAS[e.paleta]) e.paleta = ESTADO_INICIAL.paleta;
            if (!FUENTES[e.fuente]) e.fuente = ESTADO_INICIAL.fuente;
            return e;
        }
    } catch (err) { /* storage bloqueado o JSON roto: arrancamos de cero */ }
    return { ...ESTADO_INICIAL };
}

function guardarEstado() {
    try {
        localStorage.setItem(CLAVE_LS, JSON.stringify(estado));
    } catch (err) {
        // Una foto grande puede no entrar: guardamos todo menos la imagen.
        try { localStorage.setItem(CLAVE_LS, JSON.stringify({ ...estado, imagen: '' })); } catch (e2) { /* sin storage */ }
    }
}

// ------------------------------------------------------------
// UTILIDADES DE DISEÑO (copiadas de qr-cards.js)
// ------------------------------------------------------------
const px = (n) => `${Math.round(n * 10) / 10}px`;

function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, m => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
    ));
}

function hexARgba(hex, alpha) {
    const limpio = String(hex).replace('#', '');
    const completo = limpio.length === 3 ? limpio.split('').map(c => c + c).join('') : limpio;
    const num = parseInt(completo, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function luminanciaHex(hex) {
    const limpio = String(hex).replace('#', '');
    const completo = limpio.length === 3 ? limpio.split('').map(c => c + c).join('') : limpio;
    const num = parseInt(completo, 16);
    const canal = (v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * canal((num >> 16) & 255) + 0.7152 * canal((num >> 8) & 255) + 0.0722 * canal(num & 255);
}

function estiloPuntos(colorPunto, tamanoPunto = 1.5, espaciado = 16) {
    return `background-image: radial-gradient(${colorPunto} ${tamanoPunto}px, transparent ${tamanoPunto}px); background-size: ${espaciado}px ${espaciado}px;`;
}

const PATH_DESTELLO = 'M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z';

// Destello posicionado de forma absoluta (decoración)
function destello(color, tam, posicion, opacidad = 1) {
    return `<svg viewBox="0 0 24 24" width="${px(tam)}" height="${px(tam)}" style="position:absolute; z-index:5; ${posicion}" fill="${color}" fill-opacity="${opacidad}"><path d="${PATH_DESTELLO}"/></svg>`;
}

// Destello en línea (para el pie)
function chispa(color, tam) {
    return `<svg viewBox="0 0 24 24" width="${px(tam)}" height="${px(tam)}" fill="${color}" style="flex-shrink:0; display:block;"><path d="${PATH_DESTELLO}"/></svg>`;
}

// Marco tipo "visor de cámara" alrededor del QR
function esquinasQR(color, tamano, grosor) {
    const base = `position:absolute; width:${px(tamano)}; height:${px(tamano)}; border-color:${color}; border-style:solid;`;
    return `
        <div style="${base} top:-${grosor}px; left:-${grosor}px; border-width:${grosor}px 0 0 ${grosor}px; border-top-left-radius:8px;"></div>
        <div style="${base} top:-${grosor}px; right:-${grosor}px; border-width:${grosor}px ${grosor}px 0 0; border-top-right-radius:8px;"></div>
        <div style="${base} bottom:-${grosor}px; left:-${grosor}px; border-width:0 0 ${grosor}px ${grosor}px; border-bottom-left-radius:8px;"></div>
        <div style="${base} bottom:-${grosor}px; right:-${grosor}px; border-width:0 ${grosor}px ${grosor}px 0; border-bottom-right-radius:8px;"></div>
    `;
}

// Logo de Dropea: se carga una vez y se generan versión oscura y blanca.
// Si el archivo no está (o el navegador no deja leerlo, p. ej. abriendo el
// HTML con doble clic desde el disco), queda el texto "Dropea".
let logoDropeaCache = null;
async function cargarLogoDropea() {
    if (logoDropeaCache !== null) return logoDropeaCache;
    try {
        const img = await new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = RUTA_LOGO_DROPEA;
        });
        const escala = Math.min(1, 240 / img.naturalHeight);
        const w = Math.max(1, Math.round(img.naturalWidth * escala));
        const h = Math.max(1, Math.round(img.naturalHeight * escala));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const normal = canvas.toDataURL('image/png');
        const datos = ctx.getImageData(0, 0, w, h);
        for (let i = 0; i < datos.data.length; i += 4) {
            datos.data[i] = 255 - datos.data[i];
            datos.data[i + 1] = 255 - datos.data[i + 1];
            datos.data[i + 2] = 255 - datos.data[i + 2];
        }
        ctx.putImageData(datos, 0, 0);
        logoDropeaCache = { normal, invertido: canvas.toDataURL('image/png') };
    } catch (err) {
        console.warn('No se pudo cargar el logo de Dropea:', err);
        logoDropeaCache = false;
    }
    return logoDropeaCache;
}

// claro = true -> versión blanca (para fondos oscuros)
function logoHtml(dropea, claro, alto) {
    if (dropea && dropea.normal) {
        return `<img src="${claro ? dropea.invertido : dropea.normal}" alt="Dropea" style="height:${px(alto)}; width:auto; display:block;" />`;
    }
    return `<span style="display:block; font-size:${px(alto * 0.8)}; line-height:1; font-weight:800; font-style:italic; text-transform:uppercase; letter-spacing:-0.02em; color:${claro ? '#ffffff' : NEGRO_DROPEA};">Dropea</span>`;
}

// ------------------------------------------------------------
// QR (opcional)
// ------------------------------------------------------------
const qrCache = new Map();
function generarQR(link) {
    if (qrCache.has(link)) return qrCache.get(link);
    if (typeof QRCode === 'undefined') throw new Error('La librería QRCode no cargó.');

    const cont = document.createElement('div');
    cont.style.cssText = 'position:fixed; left:-9999px; top:0;';
    document.body.appendChild(cont);
    try {
        // Siempre negro sobre blanco: garantiza que escanee bien.
        new QRCode(cont, {
            text: link, width: 500, height: 500,
            colorDark: '#0b0c10', colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M,
        });
        const canvas = cont.querySelector('canvas');
        const img = cont.querySelector('img');
        const url = (canvas && canvas.toDataURL('image/png')) || (img && img.src);
        if (!url) throw new Error('No se pudo generar el código QR.');
        qrCache.set(link, url);
        return url;
    } finally {
        cont.remove();
    }
}

// ------------------------------------------------------------
// BLOQUES REUTILIZABLES
// ------------------------------------------------------------
const CONDENSADAS = new Set(Object.keys(FUENTES).filter(k => FUENTES[k].condensada));

// Un "*" al inicio o al final de una línea la resalta (sirve "*texto" y "*texto*").
function parsearTitulo(texto) {
    return String(texto || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
        const resaltada = /^\*|\*$/.test(l);
        const limpio = l.replace(/^[*\s]+|[*\s]+$/g, '');
        return { texto: limpio, resaltada };
    }).filter(l => l.texto);
}

// Resaltado sobre fondo negro: texto de color, salvo que el color de acento
// sea blanco o casi blanco (negro, grafito, blanco...): ahí no se distinguiría
// del resto del título, así que se usa una franja blanca con texto negro.
function resaltadoSobreNegro(c) {
    const apagado = c.oscuro || luminanciaHex(c.acento) > 0.8;
    return apagado
        ? `display:inline-block; background:#ffffff; color:${NEGRO_DROPEA}; padding:0 0.16em; border-radius:0.14em;`
        : `color:${c.acTexto};`;
}

// Achica el título para que la línea más larga entre en el ancho y todo el
// bloque entre en el alto disponible (cada línea es nowrap: nunca se parte).
function tamanoTitulo(lineas, anchoDisp, altoDisp, tope, condensada) {
    if (!lineas.length) return tope;
    const factor = condensada ? 0.46 : 0.66;
    const maxCh = Math.max(...lineas.map(l => l.texto.length), 1);
    const porAncho = anchoDisp / ((maxCh + 0.8) * factor);
    const porAlto = altoDisp / (lineas.length * 1.08);
    return Math.floor(Math.max(14, Math.min(tope, porAncho, porAlto)));
}

function tituloHTML(lineas, tam, colorBase, estiloResaltado) {
    if (!lineas.length) return '';
    const filas = lineas.map(l => l.resaltada
        ? `<div style="white-space:nowrap;"><span style="${estiloResaltado}">${esc(l.texto)}</span></div>`
        : `<div style="white-space:nowrap; color:${colorBase};">${esc(l.texto)}</div>`
    ).join('');
    return `<div style="font-weight:800; font-style:italic; text-transform:uppercase; letter-spacing:-0.02em; line-height:1.08; text-align:center; font-size:${px(tam)};">${filas}</div>`;
}

function textoHTML(c, color, tam, maxLineas) {
    const t = c.campos.texto.trim();
    if (!t) return '';
    return `<div style="color:${color}; font-size:${px(tam)}; font-weight:600; line-height:1.35; text-align:center; max-width:100%; display:-webkit-box; -webkit-line-clamp:${maxLineas}; -webkit-box-orient:vertical; overflow:hidden;">${esc(t).replace(/\n/g, '<br>')}</div>`;
}

function pill(c, texto, { bg, color, borde = '', size = 11, tracking = '0.2em' }) {
    if (!texto || !texto.trim()) return '';
    const u = c.u;
    return `<span style="display:inline-block; background:${bg}; color:${color}; ${borde} border-radius:9999px; padding:${px(7 * u)} ${px(16 * u)}; font-size:${px(size * u)}; font-weight:800; letter-spacing:${tracking}; text-transform:uppercase; white-space:nowrap; max-width:100%; overflow:hidden; text-overflow:ellipsis;">${esc(texto)}</span>`;
}

// Franja negra inferior con el sitio/usuario entre destellos
function barraPie(c) {
    const pie = c.campos.pie.trim();
    if (!pie) return '';
    const u = c.u;
    return `
        <div style="position:relative; z-index:2; background:${NEGRO_DROPEA}; border-radius:${px(26 * u)} ${px(26 * u)} 0 0; padding:${px(15 * u)} ${px(20 * u)} ${px(17 * u)}; display:flex; align-items:center; justify-content:center; gap:${px(10 * u)}; ${c.oscuro ? 'border-top:1px solid rgba(255,255,255,0.25);' : ''}">
            ${chispa(c.acTexto, 12 * u)}
            <span style="color:#e4e4e7; font-size:${px(11 * u)}; font-weight:800; letter-spacing:0.2em; text-transform:uppercase; white-space:nowrap;">${esc(pie)}</span>
            ${chispa(c.acTexto, 12 * u)}
        </div>`;
}

function cabecera(c, logoClaro, pillEstilo) {
    const u = c.u;
    return `
        <div style="position:relative; z-index:3; display:flex; align-items:center; justify-content:space-between; gap:${px(10 * u)}; padding:${px(26 * u)} ${px(30 * u)} 0;">
            ${logoHtml(c.dropea, logoClaro, 34 * u)}
            ${pill(c, c.campos.etiqueta, pillEstilo)}
        </div>`;
}

function qrSolo(c, tam) {
    return `
        <div style="position:relative; padding:${px(6)}; flex-shrink:0;">
            ${esquinasQR(NEGRO_DROPEA, 16 * c.u, 3)}
            <img src="${c.qr}" style="width:${px(tam)}; height:${px(tam)}; border-radius:8px; display:block;" />
        </div>`;
}

function qrTarjeta(c, tam, sombra, borde = '') {
    const u = c.u;
    return `
        <div style="position:relative; z-index:2; background:#ffffff; border-radius:${px(24 * u)}; padding:${px(12 * u)}; box-shadow:${px(6 * u)} ${px(6 * u)} 0 0 ${sombra}; ${borde} flex-shrink:0;">
            ${qrSolo(c, tam)}
        </div>`;
}

function marco(c, fondoCSS, interior) {
    return `<div style="width:${c.W}px; height:${c.H}px; position:relative; overflow:hidden; display:flex; flex-direction:column; ${c.estiloFuente} ${fondoCSS}">${interior}</div>`;
}

function glows(c) {
    return `
        <div style="position:absolute; top:-${px(c.W * 0.4)}; right:-${px(c.W * 0.32)}; width:${px(c.W * 1.0)}; height:${px(c.W * 1.0)}; border-radius:9999px; background:radial-gradient(closest-side, ${hexARgba(c.acTexto, 0.24)}, transparent);"></div>
        <div style="position:absolute; bottom:-${px(c.W * 0.46)}; left:-${px(c.W * 0.4)}; width:${px(c.W * 1.0)}; height:${px(c.W * 1.0)}; border-radius:9999px; background:radial-gradient(closest-side, ${hexARgba(c.acTexto, 0.10)}, transparent);"></div>
        <div style="position:absolute; inset:0; ${estiloPuntos('rgba(255,255,255,0.05)', 1.2, 14)}"></div>`;
}

// Zona inferior: botón (CTA) + barra con el sitio
function zonaInferiorClara(c) {
    const u = c.u;
    const cta = pill(c, c.campos.cta, {
        bg: NEGRO_DROPEA, color: c.acTexto, size: 10.5, tracking: '0.16em',
        borde: c.oscuro ? 'border:1px solid rgba(255,255,255,0.25);' : '',
    });
    const hayPie = !!c.campos.pie.trim();
    const franja = cta
        ? `<div style="position:relative; z-index:2; display:flex; justify-content:center; padding:${px(16 * u)} ${px(24 * u)} ${hayPie ? px(16 * u) : px(24 * u)};">${cta}</div>`
        : `<div style="height:${px(hayPie ? 16 * u : 24 * u)}; flex-shrink:0;"></div>`;
    return franja + barraPie(c);
}

// ------------------------------------------------------------
// PLANTILLA 1: CLARO (fondo de color + tarjeta blanca, como el cartel)
// ------------------------------------------------------------
function flyerClaro(c) {
    const { W, H, u, acento, oscuro, acTexto, sobreAcento } = c;
    const padX = 30 * u;
    const tope = Math.min(W * 0.14, H * 0.095);
    const tam = tamanoTitulo(c.lineas, W - padX * 2 - 56 * u, H * (c.qr ? 0.2 : 0.3), tope, c.condensada);
    const muyClaro = luminanciaHex(acento) > 0.8; // sobre blanco no se vería
    const resaltado = muyClaro
        ? `display:inline-block; background:${NEGRO_DROPEA}; color:#ffffff; padding:0 0.16em; border-radius:0.14em;`
        : `display:inline-block; background:${acento}; color:${sobreAcento}; padding:0 0.16em; border-radius:0.14em; ${oscuro ? 'border:1px solid rgba(0,0,0,0.25);' : ''}`;

    const tarjeta = `
        <div style="margin:${px(20 * u)} ${px(padX)} 0; flex:1; min-height:0; position:relative; z-index:2; background:#ffffff; border:3px solid ${NEGRO_DROPEA}; border-radius:${px(30 * u)}; box-shadow:${px(7 * u)} ${px(7 * u)} 0 0 ${oscuro ? 'rgba(255,255,255,0.35)' : NEGRO_DROPEA}; padding:${px(18 * u)}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(12 * u)}; overflow:hidden;">
            ${tituloHTML(c.lineas, tam, NEGRO_DROPEA, resaltado)}
            ${textoHTML(c, '#3f3f46', 15 * u, 4)}
            ${c.qr ? qrSolo(c, c.f.qrTam) : ''}
        </div>`;

    return marco(c,
        `background-color:${acento}; ${estiloPuntos(oscuro ? 'rgba(255,255,255,0.10)' : 'rgba(9,9,11,0.12)', 1.6, 15)}`,
        `
        ${destello(sobreAcento, 50 * u, `top:${px(H * 0.13)}; right:${px(10 * u)};`)}
        ${destello(sobreAcento, 20 * u, `bottom:${px(H * 0.2)}; left:${px(22 * u)};`, 0.85)}
        ${cabecera(c, oscuro, { bg: NEGRO_DROPEA, color: acTexto, size: 10, borde: oscuro ? 'border:1px solid rgba(255,255,255,0.25);' : '' })}
        ${tarjeta}
        ${zonaInferiorClara(c)}
    `);
}

// ------------------------------------------------------------
// PLANTILLA 2: OSCURO (fondo negro con brillo, como Sticker / Historia)
// ------------------------------------------------------------
function flyerOscuro(c) {
    const { W, H, u, acTexto } = c;
    const padX = 34 * u;
    const tope = Math.min(W * 0.15, H * 0.1);
    const tam = tamanoTitulo(c.lineas, W - padX * 2, H * (c.qr ? 0.22 : 0.34), tope, c.condensada);
    const resaltado = resaltadoSobreNegro(c);
    const hayPie = !!c.campos.pie.trim();

    const cta = pill(c, c.campos.cta, { bg: acTexto, color: NEGRO_DROPEA, size: 11, tracking: '0.18em' });
    const pie = hayPie
        ? `<span style="display:inline-block; border:2px solid ${acTexto}; color:${acTexto}; border-radius:9999px; padding:${px(7 * u)} ${px(16 * u)}; font-size:${px(10.5 * u)}; font-weight:800; letter-spacing:0.2em; text-transform:uppercase; white-space:nowrap; max-width:100%; overflow:hidden; text-overflow:ellipsis;">${esc(c.campos.pie.trim())}</span>`
        : '';

    return marco(c, `background:${NEGRO_DROPEA};`, `
        ${glows(c)}
        ${destello(acTexto, 50 * u, `top:${px(H * 0.2)}; right:${px(28 * u)};`)}
        ${destello('#ffffff', 16 * u, `top:${px(H * 0.3)}; left:${px(30 * u)};`, 0.45)}
        ${destello(acTexto, 20 * u, `bottom:${px(H * 0.09)}; right:${px(36 * u)};`, 0.8)}
        ${cabecera(c, true, { bg: acTexto, color: NEGRO_DROPEA, size: 10 })}
        <div style="position:relative; z-index:2; flex:1; min-height:0; padding:${px(12 * u)} ${px(padX)}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(14 * u)};">
            ${tituloHTML(c.lineas, tam, '#ffffff', resaltado)}
            ${textoHTML(c, '#d4d4d8', 15 * u, 4)}
            ${c.qr ? qrTarjeta(c, c.f.qrTam, acTexto) : ''}
        </div>
        <div style="position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; gap:${px(10 * u)}; padding:${px(8 * u)} ${px(padX)} ${px(28 * u)};">
            ${cta}
            ${pie}
        </div>
    `);
}

// ------------------------------------------------------------
// PLANTILLA 3: OFERTA (número / precio gigante en bloque negro)
// ------------------------------------------------------------
function flyerOferta(c) {
    const { W, H, u, acento, oscuro, acTexto, sobreAcento } = c;
    const padX = 30 * u;
    const tope = Math.min(W * 0.1, H * 0.07);
    const tam = tamanoTitulo(c.lineas, W - padX * 2, H * 0.17, tope, c.condensada);
    const resaltado = `display:inline-block; background:${NEGRO_DROPEA}; color:${acTexto}; padding:0 0.16em; border-radius:0.14em;`;

    const dest = c.campos.destacado.trim();
    const factor = c.condensada ? 0.5 : 0.7;
    const tamDest = Math.floor(Math.max(24, Math.min(
        W * 0.26,
        H * (c.qr ? 0.16 : 0.22),
        (W - padX * 2 - 56 * u) / (Math.max(dest.length, 1) * factor)
    )));
    const bloque = dest ? `
        <div style="position:relative; z-index:2; background:${NEGRO_DROPEA}; ${oscuro ? 'border:1px solid rgba(255,255,255,0.25);' : ''} border-radius:${px(30 * u)}; padding:${px(12 * u)} ${px(26 * u)} ${px(14 * u)}; box-shadow:${px(8 * u)} ${px(8 * u)} 0 0 ${oscuro ? 'rgba(255,255,255,0.35)' : '#ffffff'}; color:${acTexto}; font-weight:800; font-style:italic; text-transform:uppercase; letter-spacing:-0.03em; line-height:1; white-space:nowrap; font-size:${px(tamDest)};">${esc(dest)}</div>` : '';

    return marco(c,
        `background-color:${acento}; ${estiloPuntos(oscuro ? 'rgba(255,255,255,0.10)' : 'rgba(9,9,11,0.12)', 1.6, 15)}`,
        `
        ${destello(sobreAcento, 46 * u, `top:${px(H * 0.12)}; right:${px(14 * u)};`)}
        ${destello(sobreAcento, 20 * u, `bottom:${px(H * 0.2)}; left:${px(24 * u)};`, 0.85)}
        ${cabecera(c, oscuro, { bg: NEGRO_DROPEA, color: acTexto, size: 10, borde: oscuro ? 'border:1px solid rgba(255,255,255,0.25);' : '' })}
        <div style="position:relative; z-index:2; flex:1; min-height:0; padding:${px(10 * u)} ${px(padX)} 0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(14 * u)};">
            ${tituloHTML(c.lineas, tam, sobreAcento, resaltado)}
            ${bloque}
            ${textoHTML(c, sobreAcento, 15 * u, 3)}
            ${c.qr ? qrTarjeta(c, c.f.qrTam, NEGRO_DROPEA, `border:3px solid ${NEGRO_DROPEA};`) : ''}
        </div>
        ${zonaInferiorClara(c)}
    `);
}

// ------------------------------------------------------------
// PLANTILLA 4: FOTO (imagen en tarjeta blanca sobre fondo negro)
// ------------------------------------------------------------
function flyerFoto(c) {
    const { W, H, u, acTexto } = c;
    const padX = 30 * u;
    const tope = Math.min(W * 0.11, H * 0.075);
    const tam = tamanoTitulo(c.lineas, W - padX * 2, H * 0.17, tope, c.condensada);
    const resaltado = resaltadoSobreNegro(c);
    const hayPie = !!c.campos.pie.trim();

    const interior = c.imagen
        ? `<img src="${c.imagen}" style="width:100%; height:100%; object-fit:cover; display:block;" />`
        : `<div style="width:100%; height:100%; background:${hexARgba(acTexto, 0.18)}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(10 * u)};">
               ${chispa(acTexto, 46 * u)}
               <span style="color:#a1a1aa; font-size:${px(11 * u)}; font-weight:800; letter-spacing:0.18em; text-transform:uppercase;">Subí una imagen</span>
           </div>`;

    const tarjetaFoto = `
        <div style="position:relative; z-index:2; flex:1; min-height:0; margin:${px(18 * u)} ${px(padX)} 0; background:#ffffff; border-radius:${px(30 * u)}; box-shadow:${px(7 * u)} ${px(7 * u)} 0 0 ${acTexto};">
            <div style="position:absolute; inset:${px(10 * u)}; border-radius:${px(22 * u)}; overflow:hidden;">
                ${interior}
                ${c.qr ? `<div style="position:absolute; right:${px(12 * u)}; bottom:${px(12 * u)};">${qrTarjeta(c, c.f.qrTam * 0.8, acTexto)}</div>` : ''}
            </div>
        </div>`;

    const cta = pill(c, c.campos.cta, { bg: acTexto, color: NEGRO_DROPEA, size: 10.5, tracking: '0.16em' });
    const pie = hayPie
        ? `<span style="color:#a1a1aa; font-size:${px(10 * u)}; font-weight:800; letter-spacing:0.2em; text-transform:uppercase; white-space:nowrap;">${esc(c.campos.pie.trim())}</span>`
        : '';
    const filaInferior = (cta || pie)
        ? `<div style="display:flex; align-items:center; justify-content:center; gap:${px(12 * u)}; flex-wrap:nowrap;">${cta}${pie}</div>`
        : '';

    return marco(c, `background:${NEGRO_DROPEA};`, `
        ${glows(c)}
        ${destello(acTexto, 36 * u, `top:${px(H * 0.1)}; right:${px(90 * u)};`, 0.9)}
        ${cabecera(c, true, { bg: acTexto, color: NEGRO_DROPEA, size: 10 })}
        ${tarjetaFoto}
        <div style="position:relative; z-index:2; padding:${px(16 * u)} ${px(padX)} ${px(24 * u)}; display:flex; flex-direction:column; align-items:center; gap:${px(8 * u)};">
            ${tituloHTML(c.lineas, tam, '#ffffff', resaltado)}
            ${textoHTML(c, '#d4d4d8', 13.5 * u, 2)}
            ${filaInferior ? `<div style="margin-top:${px(4 * u)};">${filaInferior}</div>` : ''}
        </div>
    `);
}

const CONSTRUCTORES = { claro: flyerClaro, oscuro: flyerOscuro, oferta: flyerOferta, foto: flyerFoto };

// ------------------------------------------------------------
// RENDER (vista previa escalada dentro del stage)
// ------------------------------------------------------------
let tokenRender = 0;

function esperarFuente(fuente) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const carga = Promise.all([
        `italic 800 24px ${fuente.family}`,
        `800 24px ${fuente.family}`,
        `600 24px ${fuente.family}`,
    ].map(f => document.fonts.load(f).catch(() => null)));
    // No colgamos la vista previa si Google Fonts tarda o no responde.
    return Promise.race([carga, new Promise(r => setTimeout(r, 1500))]);
}

async function render() {
    const token = ++tokenRender;
    const stage = document.getElementById('stage');
    if (!stage) return;

    const f = FORMATOS[estado.formato];
    const fuente = FUENTES[estado.fuente];
    const acento = PALETAS[estado.paleta].acento;
    const oscuro = luminanciaHex(acento) < 0.18;

    await esperarFuente(fuente);
    const dropea = await cargarLogoDropea();

    let qr = null;
    const link = estado.qrLink.trim();
    if (estado.qrActivo && link) {
        try { qr = generarQR(link); } catch (err) { console.error('QR:', err); avisoQR(true); }
    }
    if (estado.qrActivo && link && qr) avisoQR(false);

    if (token !== tokenRender) return; // llegó un render más nuevo

    const contexto = {
        f, W: f.ancho, H: f.alto, u: f.ancho / 480,
        acento, oscuro,
        acTexto: oscuro ? '#ffffff' : acento,
        sobreAcento: oscuro ? '#ffffff' : NEGRO_DROPEA,
        estiloFuente: `font-family:${fuente.family};`,
        condensada: CONDENSADAS.has(estado.fuente),
        dropea, qr,
        imagen: estado.imagen,
        lineas: parsearTitulo(estado.titulo),
        campos: {
            etiqueta: estado.etiqueta || '',
            texto: estado.texto || '',
            destacado: estado.destacado || '',
            cta: estado.cta || '',
            pie: estado.pie || '',
        },
    };

    const html = CONSTRUCTORES[estado.plantilla](contexto);

    const estilos = getComputedStyle(stage);
    const padX = parseFloat(estilos.paddingLeft) + parseFloat(estilos.paddingRight);
    const padY = parseFloat(estilos.paddingTop) + parseFloat(estilos.paddingBottom);
    const anchoDisp = (stage.clientWidth || 320) - padX;
    const altoDisp = (stage.clientHeight || 420) - padY;
    const escala = Math.min(anchoDisp / f.ancho, altoDisp / f.alto, 1);

    stage.innerHTML = `
        <div style="width:${f.ancho * escala}px; height:${f.alto * escala}px;" class="mx-auto overflow-hidden rounded-2xl shadow-xl border border-slate-200 flex-shrink-0">
            <div id="flyer-real" style="width:${f.ancho}px; height:${f.alto}px; transform:scale(${escala}); transform-origin: top left;">
                ${html}
            </div>
        </div>`;
}

function avisoQR(mostrar) {
    const el = document.getElementById('qr-aviso');
    if (el) el.classList.toggle('hidden', !mostrar);
}

let temporizadorRender = null;
function renderDiferido() {
    clearTimeout(temporizadorRender);
    temporizadorRender = setTimeout(render, 110);
}

// ------------------------------------------------------------
// CONTROLES
// ------------------------------------------------------------
function $(id) { return document.getElementById(id); }

function construirTiles() {
    $('tiles-formato').innerHTML = Object.entries(FORMATOS).map(([key, f]) => `
        <button type="button" id="tile-formato-${key}" class="tile" data-formato="${key}" title="${f.label} · ${f.sub}">
            <span class="tile-forma" style="aspect-ratio:${f.ancho}/${f.alto};"></span>
            <span class="tile-label">${f.label}</span>
            <span class="tile-sub">${f.sub}</span>
        </button>`).join('');

    $('tiles-plantilla').innerHTML = Object.entries(PLANTILLAS).map(([key, p]) => `
        <button type="button" id="tile-plantilla-${key}" class="tile" data-plantilla="${key}" title="${p.label} · ${p.sub}">
            <span class="tile-label">${p.label}</span>
            <span class="tile-sub">${p.sub}</span>
        </button>`).join('');

    $('paleta-grid').innerHTML = Object.entries(PALETAS).map(([key, p]) => `
        <button type="button" id="color-${key}" class="swatch" data-paleta="${key}" style="background:${p.acento};" title="${p.label}" aria-label="Color ${p.label}"></button>`).join('');

    $('fuente-lista').innerHTML = Object.entries(FUENTES).map(([key, f]) => `
        <button type="button" id="fuente-${key}" class="fuente-op" data-fuente="${key}">
            <span class="fuente-aa" style="font-family:${f.family};">Aa</span>
            <span class="fuente-nombre">${f.label}</span>
            <span class="fuente-check">✓</span>
        </button>`).join('');
}

// Refleja el estado en la interfaz (tiles activos, campos visibles, etc.)
function sincronizarControles() {
    Object.keys(FORMATOS).forEach(k => $(`tile-formato-${k}`).classList.toggle('tile-activo', k === estado.formato));
    Object.keys(PLANTILLAS).forEach(k => $(`tile-plantilla-${k}`).classList.toggle('tile-activo', k === estado.plantilla));
    Object.keys(PALETAS).forEach(k => $(`color-${k}`).classList.toggle('swatch-activo', k === estado.paleta));
    Object.keys(FUENTES).forEach(k => $(`fuente-${k}`).classList.toggle('fuente-activa', k === estado.fuente));

    $('dot-color').style.background = PALETAS[estado.paleta].acento;
    $('nombre-color').textContent = PALETAS[estado.paleta].label;
    $('aa-fuente').style.fontFamily = FUENTES[estado.fuente].family;
    $('nombre-fuente').textContent = FUENTES[estado.fuente].label;

    // Campos que solo aplican a ciertas plantillas
    document.querySelectorAll('[data-plantillas]').forEach(el => {
        const lista = el.dataset.plantillas.split(',');
        el.classList.toggle('hidden', !lista.includes(estado.plantilla));
    });

    $('in-qr-link').disabled = !estado.qrActivo;
    $('qr-link-wrap').classList.toggle('opacity-50', !estado.qrActivo);

    const hayImagen = !!estado.imagen;
    $('btn-quitar-imagen').classList.toggle('hidden', !hayImagen);
    $('nombre-imagen').textContent = hayImagen ? 'Imagen cargada' : 'Ninguna imagen seleccionada';
}

// Vuelca el estado en los inputs (solo al iniciar o al restablecer)
function llenarInputs() {
    $('in-etiqueta').value = estado.etiqueta;
    $('in-titulo').value = estado.titulo;
    $('in-texto').value = estado.texto;
    $('in-destacado').value = estado.destacado;
    $('in-cta').value = estado.cta;
    $('in-pie').value = estado.pie;
    $('chk-qr').checked = estado.qrActivo;
    $('in-qr-link').value = estado.qrLink;
}

function actualizar(rapido = false) {
    guardarEstado();
    sincronizarControles();
    if (rapido) render(); else renderDiferido();
}

function togglePanel(id, chevronId) {
    const panel = $(id);
    const abrir = panel.classList.contains('hidden');
    ['panel-color', 'panel-fuente'].forEach(p => $(p).classList.add('hidden'));
    ['chev-color', 'chev-fuente'].forEach(c => $(c).classList.remove('rotate-180'));
    if (abrir) {
        panel.classList.remove('hidden');
        $(chevronId).classList.add('rotate-180');
    }
}

// Reduce la foto subida (máx. 1600 px) para que pese poco y exporte rápido.
function leerImagen(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onerror = reject;
        lector.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const max = 1600;
                const escala = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(img.naturalWidth * escala);
                canvas.height = Math.round(img.naturalHeight * escala);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.88));
            };
            img.src = lector.result;
        };
        lector.readAsDataURL(archivo);
    });
}

function mostrarToast(mensaje, tipo = 'ok') {
    const t = $('toast');
    t.textContent = mensaje;
    t.className = `toast toast-${tipo}`;
    clearTimeout(mostrarToast._t);
    mostrarToast._t = setTimeout(() => t.classList.add('hidden'), 3200);
}

// true solo en celular/tablet real (ver qr-cards.js: se basa en el userAgent)
function esMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// ------------------------------------------------------------
// TIPOGRAFÍA PARA LA EXPORTACIÓN
// Pide a Google Fonts el CSS de la fuente elegida, se queda con los
// subconjuntos latin y latin-ext (alcanzan para español) y convierte cada
// archivo de fuente a data URL, así el PNG no depende de que el navegador
// haya "adivinado" qué fuentes incrustar.
// ------------------------------------------------------------
const cacheCSSFuentes = new Map();

function blobADataURL(blob) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = reject;
        lector.readAsDataURL(blob);
    });
}

async function cssFuenteIncrustada(clave) {
    if (cacheCSSFuentes.has(clave)) return cacheCSSFuentes.get(clave);

    const resp = await fetch(`https://fonts.googleapis.com/css2?family=${FUENTES[clave].gf}&display=swap`);
    if (!resp.ok) throw new Error(`Google Fonts respondió ${resp.status}`);
    const css = await resp.text();

    // Google marca cada bloque con un comentario: /* latin */ @font-face {...}
    let bloques = [];
    const conSubset = /\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
    let m;
    while ((m = conSubset.exec(css)) !== null) {
        if (m[1] === 'latin' || m[1] === 'latin-ext') bloques.push(m[2]);
    }
    if (!bloques.length) bloques = css.match(/@font-face\s*\{[^}]*\}/g) || [];
    if (!bloques.length) throw new Error('El CSS de la fuente vino vacío.');

    const incrustados = await Promise.all(bloques.map(async (bloque) => {
        const urls = [...new Set((bloque.match(/url\((https?:[^)]+)\)/g) || [])
            .map(u => u.slice(4, -1).replace(/^['"]|['"]$/g, '')))];
        let salida = bloque;
        for (const url of urls) {
            const r = await fetch(url);
            if (!r.ok) throw new Error(`No se pudo bajar la fuente (${r.status})`);
            const dataUrl = await blobADataURL(await r.blob());
            salida = salida.split(url).join(dataUrl);
        }
        return salida;
    }));

    const resultado = incrustados.join('\n');
    cacheCSSFuentes.set(clave, resultado);
    return resultado;
}

// ------------------------------------------------------------
// DESCARGA (PNG de 1080 px de ancho, listo para Instagram)
// ------------------------------------------------------------
async function descargarFlyer() {
    const btn = $('btn-descargar');
    const label = $('lbl-descargar');
    const textoOriginal = label.textContent;
    btn.disabled = true;
    label.textContent = 'Generando…';

    try {
        // Si hay un render pendiente (se estaba tipeando), lo resolvemos antes.
        clearTimeout(temporizadorRender);
        await render();

        const nodo = $('flyer-real');
        if (!nodo) throw new Error('No hay flyer para exportar.');
        const f = FORMATOS[estado.formato];

        // Misma receta que qr-cards.js: forzar la carga real de la fuente,
        // incrustarla una vez y hacer una pasada de "calentamiento".
        const familia = FUENTES[estado.fuente].family;
        if (document.fonts && document.fonts.load) {
            await Promise.all([
                `italic 800 24px ${familia}`,
                `800 24px ${familia}`,
                `600 24px ${familia}`,
                `400 24px ${familia}`,
            ].map(x => document.fonts.load(x).catch(() => null)));
            await document.fonts.ready;
        }

        const opciones = {
            pixelRatio: ANCHO_SALIDA / f.ancho,
            backgroundColor: '#ffffff',
            style: { transform: 'none' },
            cacheBust: true,
        };
        // Incrustamos la tipografía nosotros mismos (ver cssFuenteIncrustada):
        // si html-to-image no detecta la fuente devuelve un CSS vacío, y un
        // string vacío cuenta como "ya resuelto", así que exportaba con la
        // fuente de reemplazo del navegador.
        let cssFuente = '';
        try {
            cssFuente = await cssFuenteIncrustada(estado.fuente);
        } catch (err) {
            console.warn('No se pudo incrustar la tipografía a mano:', err);
        }
        if (!cssFuente) {
            try {
                cssFuente = await htmlToImage.getFontEmbedCSS(nodo, opciones);
            } catch (err) {
                console.warn('No se pudo precalcular el CSS de fuentes:', err);
            }
        }
        // Si seguimos sin nada, no lo seteamos: así la librería hace su propio intento.
        if (cssFuente) opciones.fontEmbedCSS = cssFuente;

        await htmlToImage.toPng(nodo, { ...opciones, pixelRatio: 1 });
        const dataUrl = await htmlToImage.toPng(nodo, opciones);

        const base = parsearTitulo(estado.titulo)[0];
        const slug = (base ? base.texto : 'flyer').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'flyer';
        const nombreArchivo = `dropea-${f.archivo}-${slug}.png`;

        const blob = await (await fetch(dataUrl)).blob();
        const archivo = new File([blob], nombreArchivo, { type: 'image/png' });

        if (esMobile() && navigator.canShare && navigator.canShare({ files: [archivo] })) {
            await navigator.share({ files: [archivo], title: 'Dropea · ' + f.label });
            mostrarToast('¡Listo! Guardala o compartila desde el panel.');
        } else {
            const a = document.createElement('a');
            a.download = nombreArchivo;
            a.href = dataUrl;
            document.body.appendChild(a);
            a.click();
            a.remove();
            mostrarToast('Imagen descargada, lista para subir a Instagram.');
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Error exportando el flyer:', err);
            mostrarToast('No se pudo generar la imagen. Probá de nuevo.', 'error');
        }
    } finally {
        btn.disabled = false;
        label.textContent = textoOriginal;
    }
}

// ------------------------------------------------------------
// INICIO
// ------------------------------------------------------------
function iniciar() {
    cargarGoogleFonts();
    construirTiles();
    llenarInputs();
    sincronizarControles();

    $('tiles-formato').addEventListener('click', (e) => {
        const b = e.target.closest('[data-formato]');
        if (!b) return;
        estado.formato = b.dataset.formato;
        actualizar(true);
    });
    $('tiles-plantilla').addEventListener('click', (e) => {
        const b = e.target.closest('[data-plantilla]');
        if (!b) return;
        estado.plantilla = b.dataset.plantilla;
        actualizar(true);
    });
    $('paleta-grid').addEventListener('click', (e) => {
        const b = e.target.closest('[data-paleta]');
        if (!b) return;
        estado.paleta = b.dataset.paleta;
        actualizar(true);
    });
    $('fuente-lista').addEventListener('click', (e) => {
        const b = e.target.closest('[data-fuente]');
        if (!b) return;
        estado.fuente = b.dataset.fuente;
        actualizar(true);
    });

    $('btn-color').addEventListener('click', () => togglePanel('panel-color', 'chev-color'));
    $('btn-fuente').addEventListener('click', () => togglePanel('panel-fuente', 'chev-fuente'));

    const campos = {
        'in-etiqueta': 'etiqueta', 'in-titulo': 'titulo', 'in-texto': 'texto',
        'in-destacado': 'destacado', 'in-cta': 'cta', 'in-pie': 'pie', 'in-qr-link': 'qrLink',
    };
    Object.entries(campos).forEach(([id, clave]) => {
        $(id).addEventListener('input', (e) => { estado[clave] = e.target.value; actualizar(); });
    });

    $('chk-qr').addEventListener('change', (e) => {
        estado.qrActivo = e.target.checked;
        if (!estado.qrActivo) avisoQR(false);
        actualizar(true);
    });

    $('in-imagen').addEventListener('change', async (e) => {
        const archivo = e.target.files && e.target.files[0];
        if (!archivo) return;
        try {
            estado.imagen = await leerImagen(archivo);
            if (estado.plantilla !== 'foto') estado.plantilla = 'foto';
            actualizar(true);
        } catch (err) {
            console.error(err);
            mostrarToast('No se pudo leer la imagen.', 'error');
        }
        e.target.value = '';
    });
    $('btn-quitar-imagen').addEventListener('click', () => {
        estado.imagen = '';
        actualizar(true);
    });

    $('btn-descargar').addEventListener('click', descargarFlyer);
    $('btn-reset').addEventListener('click', () => {
        if (!confirm('¿Restablecer todo el contenido a los valores iniciales?')) return;
        estado = { ...ESTADO_INICIAL };
        llenarInputs();
        actualizar(true);
    });

    // Cerrar los paneles de color/tipografía al hacer clic afuera
    document.addEventListener('click', (e) => {
        if (e.target.closest('#btn-color') || e.target.closest('#panel-color') ||
            e.target.closest('#btn-fuente') || e.target.closest('#panel-fuente')) return;
        ['panel-color', 'panel-fuente'].forEach(p => $(p).classList.add('hidden'));
        ['chev-color', 'chev-fuente'].forEach(c => $(c).classList.remove('rotate-180'));
    });

    window.addEventListener('resize', renderDiferido);
    render();
}

document.addEventListener('DOMContentLoaded', iniciar);