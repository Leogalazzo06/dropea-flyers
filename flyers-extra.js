// ============================================================
// PLANTILLAS EXTRA — Dropea flyers (se carga DESPUÉS de flyers.js)
// Suma 4 estilos nuevos reutilizando los bloques de flyers.js.
// Para agregar otro: función flyerX(c) + una línea en PLANTILLAS y CONSTRUCTORES.
// ============================================================

// Rota el tono de un color (grados) y opcionalmente cambia la luz (-1..1)
function rotarHex(hex, grados, luz = 0) {
    const n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = d === 0 ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + grados + 360) % 360;
    let l = (mx + mn) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    l = Math.max(0, Math.min(1, l + luz));
    const k = (v) => { const a = s * Math.min(l, 1 - l), t = (v + h / 30) % 12; return l - a * Math.max(-1, Math.min(t - 3, 9 - t, 1)); };
    return '#' + [k(0), k(8), k(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

// Título con opciones: italic, align, ls (letter-spacing), lh (line-height)
function tituloExtra(c, tam, base, resaltado, o = {}) {
    const filas = c.lineas.map(l => l.resaltada
        ? `<div style="white-space:nowrap;"><span style="${resaltado}">${esc(l.texto)}</span></div>`
        : `<div style="white-space:nowrap; color:${base};">${esc(l.texto)}</div>`).join('');
    return `<div style="font-weight:800; font-style:${o.italic === false ? 'normal' : 'italic'}; text-transform:uppercase; letter-spacing:${o.ls || '-0.02em'}; line-height:${o.lh || 1.05}; text-align:${o.align || 'center'}; font-size:${px(tam)}; ${o.extra || ''}">${filas}</div>`;
}

const juntarColumna = (u, ...partes) => { const p = partes.filter(Boolean); return p.length > 1 ? `<div style="display:flex; flex-direction:column; gap:${px(8 * u)};">${p.join('')}</div>` : (p[0] || ''); };

const pieTexto = (c, color, size = 10) => c.campos.pie.trim()
    ? `<span style="color:${color}; font-size:${px(size * c.u)}; font-weight:800; letter-spacing:0.2em; text-transform:uppercase; white-space:nowrap;">${esc(c.campos.pie.trim())}</span>` : '';

// ---------- AURORA: cristal sobre luces de color ----------
function flyerAurora(c) {
    const { W, H, u, acTexto } = c, padX = 30 * u;
    const a2 = rotarHex(acTexto, 50), a3 = rotarHex(acTexto, -60);
    const blob = (col, d, pos, op) => `<div style="position:absolute; ${pos} width:${px(d)}; height:${px(d)}; border-radius:9999px; background:radial-gradient(closest-side, ${hexARgba(col, op)}, transparent);"></div>`;
    const tam = tamanoTitulo(c.lineas, W - padX * 2 - 64 * u, H * 0.3, Math.min(W * 0.13, H * 0.09), c.condensada);
    const cta = pill(c, c.campos.cta, { bg: '#ffffff', color: NEGRO_DROPEA, size: 10.5, tracking: '0.16em' });
    return marco(c, `background:${NEGRO_DROPEA};`, `
        ${blob(acTexto, W * 1.1, `top:-${px(W * 0.35)}; left:-${px(W * 0.35)};`, 0.55)}
        ${blob(a2, W * 0.95, `bottom:-${px(W * 0.3)}; right:-${px(W * 0.3)};`, 0.5)}
        ${blob(a3, W * 0.6, `top:${px(H * 0.4)}; right:-${px(W * 0.15)};`, 0.35)}
        ${destello('#ffffff', 22 * u, `top:${px(H * 0.2)}; left:${px(W * 0.12)};`, 0.7)}
        ${cabecera(c, true, { bg: 'rgba(255,255,255,0.14)', color: '#ffffff', size: 10, borde: 'border:1px solid rgba(255,255,255,0.35);' })}
        <div style="position:relative; flex:1; min-height:0; margin:${px(18 * u)} ${px(padX)} 0; border-radius:${px(32 * u)}; background:linear-gradient(160deg, rgba(255,255,255,0.20), rgba(255,255,255,0.05)); border:1px solid rgba(255,255,255,0.32); box-shadow:inset 0 1px 0 rgba(255,255,255,0.4), 0 ${px(18 * u)} ${px(40 * u)} rgba(0,0,0,0.35); padding:${px(18 * u)}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(12 * u)};">
            ${movible(c, 'titulo', tituloExtra(c, tam * (c.tituloZoom || 100) / 100, '#ffffff', resaltadoSobreNegro(c), { italic: false, ls: '-0.03em' }))}
            ${movible(c, 'texto', textoHTML(c, '#e4e4e7', 15 * u, 4))}
        </div>
        <div style="position:relative; display:flex; flex-direction:column; align-items:center; gap:${px(9 * u)}; padding:${px(16 * u)} ${px(padX)} ${px(24 * u)};">
            ${movible(c, 'cta', cta)}${movible(c, 'pie', pieTexto(c, '#d4d4d8'))}
        </div>`);
}

// ---------- RAYOS: estilo pop con rayos y sticker ----------
function flyerRayos(c) {
    const { W, H, u, acento, oscuro, acTexto } = c, K = NEGRO_DROPEA, padX = 28 * u;
    const clara = rotarHex(acento, 0, oscuro ? 0.08 : 0.12);
    const tam = tamanoTitulo(c.lineas, W - padX * 2, H * 0.34, Math.min(W * 0.16, H * 0.11), c.condensada) * (c.tituloZoom || 100) / 100;
    const contorno = [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1], [-1, 0], [1, 0]].map(([x, y]) => `${x * 0.035}em ${y * 0.035}em 0 ${K}`).join(',');
    const res = `display:inline-block; background:${K}; color:${acTexto}; padding:0 0.16em; border-radius:0.14em; text-shadow:none;`;
    const estrella = (n, r1, r2) => Array.from({ length: n * 2 }, (_, i) => { const a = Math.PI * i / n, r = i % 2 ? r2 : r1; return `${(50 + r * Math.sin(a)).toFixed(1)},${(50 - r * Math.cos(a)).toFixed(1)}`; }).join(' ');
    const dest = c.campos.destacado.trim();
    const D = Math.min(W, H) * 0.3;
    const tf = Math.floor(Math.min(D * 0.3, D * 0.72 / (Math.max(dest.length, 1) * (c.condensada ? 0.45 : 0.68))));
    const badge = dest ? `<div style="position:relative; width:${px(D)}; height:${px(D)}; transform:rotate(-10deg);"><svg viewBox="0 0 100 100" width="100%" height="100%" style="position:absolute; inset:0;"><polygon points="${estrella(14, 49, 40)}" fill="${K}"/></svg><div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:${acTexto}; font-weight:800; font-style:italic; text-transform:uppercase; letter-spacing:-0.03em; line-height:1; white-space:nowrap; font-size:${px(tf)};">${esc(dest)}</div></div>` : '';
    const t = textoHTML(c, '#27272a', 14 * u, 3);
    const caja = t ? `<div style="background:#ffffff; border:3px solid ${K}; border-radius:${px(18 * u)}; padding:${px(8 * u)} ${px(16 * u)}; box-shadow:${px(4 * u)} ${px(4 * u)} 0 0 ${K}; max-width:100%;">${t}</div>` : '';
    return marco(c, `background:repeating-conic-gradient(from 0deg at 50% 45%, ${clara} 0deg 8deg, ${acento} 8deg 16deg);`, `
        ${destello('#ffffff', 34 * u, `bottom:${px(H * 0.22)}; left:${px(18 * u)};`)}
        <div style="position:absolute; z-index:8; top:${px(H * 0.15)}; right:${px(10 * u)};">${movible(c, 'destacado', badge)}</div>
        ${cabecera(c, oscuro, { bg: K, color: acTexto, size: 10, borde: oscuro ? 'border:1px solid rgba(255,255,255,0.25);' : '' })}
        <div style="position:relative; flex:1; min-height:0; padding:${px(10 * u)} ${px(padX)} 0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(16 * u)};">
            ${movible(c, 'titulo', tituloExtra(c, tam, '#ffffff', res, { extra: `text-shadow:${contorno}, ${0.06}em ${0.1}em 0 ${K};` }))}
            ${movible(c, 'texto', caja)}
        </div>
        ${zonaInferiorClara(c)}`);
}

// ---------- CINTA: franjas diagonales tipo precinto ----------
function flyerCinta(c) {
    const { W, H, u, acTexto } = c, K = NEGRO_DROPEA, padX = 30 * u;
    const tam = tamanoTitulo(c.lineas, W - padX * 2, H * 0.3, Math.min(W * 0.15, H * 0.1), c.condensada);
    const cinta = (txt, bg, giro, top) => {
        const it = `<span style="display:inline-flex; align-items:center; gap:${px(14 * u)}; margin-right:${px(14 * u)};">${esc(txt)}${chispa(K, 12 * u)}</span>`;
        return `<div style="position:absolute; z-index:4; left:-15%; width:130%; top:${px(top)}; transform:rotate(${giro}deg); background:${bg}; color:${K}; padding:${px(7 * u)} 0; white-space:nowrap; overflow:hidden; font-size:${px(13 * u)}; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; box-shadow:0 ${px(4 * u)} ${px(10 * u)} rgba(0,0,0,0.4);">${it.repeat(14)}</div>`;
    };
    const cta = pill(c, c.campos.cta, { bg: acTexto, color: K, size: 11, tracking: '0.18em' });
    return marco(c, `background-color:${K}; ${estiloPuntos('rgba(255,255,255,0.06)', 1.2, 14)}`, `
        ${cinta(c.campos.etiqueta.trim() || 'Dropea', acTexto, -5, H * 0.17)}
        ${cinta(c.campos.pie.trim() || 'Dropea', '#ffffff', 5, H * 0.88)}
        <div style="position:relative; padding:${px(24 * u)} ${px(padX)} 0;">${movible(c, 'logo', logoHtml(c.dropea, true, 32 * u), 'flex-shrink:0;')}</div>
        <div style="position:relative; flex:1; min-height:0; padding:${px(H * 0.12)} ${px(padX)} ${px(H * 0.17)}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(14 * u)};">
            ${movible(c, 'titulo', tituloExtra(c, tam * (c.tituloZoom || 100) / 100, '#ffffff', resaltadoSobreNegro(c)))}
            ${movible(c, 'texto', textoHTML(c, '#d4d4d8', 15 * u, 3))}
            ${movible(c, 'cta', cta)}
        </div>`);
}

// ---------- DEGRADADO: color a pantalla completa, texto grande a la izquierda ----------
function flyerDegradado(c) {
    const { W, H, u, acento, oscuro } = c, K = NEGRO_DROPEA, padX = 32 * u;
    const clara = !oscuro && luminanciaHex(acento) > 0.35;
    const t = clara ? K : '#ffffff', inv = clara ? '#ffffff' : K;
    const tam = tamanoTitulo(c.lineas, W - padX * 2, H * 0.4, Math.min(W * 0.17, H * 0.13), c.condensada) * (c.tituloZoom || 100) / 100;
    const res = `display:inline-block; background:${t}; color:${inv}; padding:0 0.14em; border-radius:0.16em;`;
    const anillo = (d) => `<div style="position:absolute; width:${px(d)}; height:${px(d)}; left:${px(W * 0.85 - d / 2)}; top:${px(H * 0.14 - d / 2)}; border-radius:9999px; border:${px(2 * u)} solid ${hexARgba(t, 0.25)};"></div>`;
    const dest = c.campos.destacado.trim();
    const tf = Math.floor(Math.min(W * 0.1, (W - padX * 2 - 40 * u) / (Math.max(dest.length, 1) * 0.7)));
    const sticker = dest ? `<div style="display:inline-block; transform:rotate(-5deg); background:${K}; color:#ffffff; border-radius:9999px; padding:${px(4 * u)} ${px(18 * u)}; font-weight:800; font-style:italic; text-transform:uppercase; letter-spacing:-0.02em; white-space:nowrap; font-size:${px(tf)};">${esc(dest)}</div>` : '';
    const txt = c.campos.texto.trim() ? `<div style="color:${t}; font-size:${px(15 * u * (c.textoZoom || 100) / 100)}; font-weight:600; line-height:1.35; max-width:${px(W * 0.82)};">${esc(c.campos.texto.trim()).replace(/\n/g, '<br>')}</div>` : '';
    const cta = pill(c, c.campos.cta, { bg: t, color: inv, size: 11, tracking: '0.16em' });
    const fila = (cta || c.campos.pie.trim()) ? `<div style="display:flex; align-items:center; gap:${px(14 * u)};">${movible(c, 'cta', cta)}${movible(c, 'pie', pieTexto(c, t))}</div>` : '';
    return marco(c, `background:linear-gradient(150deg, ${acento}, ${rotarHex(acento, 40, -0.05)});`, `
        ${anillo(W * 0.5)}${anillo(W * 0.8)}${anillo(W * 1.1)}
        ${destello(t, 30 * u, `top:${px(H * 0.42)}; right:${px(24 * u)};`, 0.9)}
        ${cabecera(c, !clara, { bg: t, color: inv, size: 10 })}
        <div style="position:relative; flex:1; min-height:0; padding:${px(10 * u)} ${px(padX)} ${px(30 * u)}; display:flex; flex-direction:column; align-items:flex-start; justify-content:flex-end; gap:${px(14 * u)};">
            ${movible(c, 'destacado', sticker)}
            ${movible(c, 'titulo', tituloExtra(c, tam, t, res, { italic: false, align: 'left', ls: '-0.04em', lh: 0.98 }))}
            ${movible(c, 'texto', juntarColumna(u, txt, itemsHTML(c, t, 15 * u, 'left')))}
            ${fila}
        </div>`);
}

Object.assign(PLANTILLAS, {
    aurora:    { label: 'Aurora',    sub: 'Cristal sobre luces de color' },
    rayos:     { label: 'Rayos',     sub: 'Estilo pop con sticker' },
    cinta:     { label: 'Cinta',     sub: 'Franjas diagonales' },
    degradado: { label: 'Degradado', sub: 'Color a pantalla completa' },
});
Object.assign(CONSTRUCTORES, { aurora: flyerAurora, rayos: flyerRayos, cinta: flyerCinta, degradado: flyerDegradado });

// ---------- PRODUCTO: afiche de venta de un producto (foto + precio + beneficios) ----------
// Campos: Título (renglones normales = encabezado, con * = nombre/modelo gigante),
// Etiqueta = texto sobre el precio ("Por apenas:"), Texto gigante = precio,
// Texto de apoyo = beneficios (un renglón por viñeta), Botón = cuotas/pago, Pie = contacto.
function flyerProducto(c) {
    const { W, H, u, acTexto } = c, K = NEGRO_DROPEA, padX = 30 * u, col = W * 0.62;
    const heads = c.lineas.filter(l => !l.resaltada), giants = c.lineas.filter(l => l.resaltada);
    const th = tamanoTitulo(heads, col - padX - 16 * u, H * 0.13, 24 * u, c.condensada);
    const tg = tamanoTitulo(giants, col - padX, H * 0.2, Math.min(W * 0.2, H * 0.16), c.condensada) * (c.tituloZoom || 100) / 100;
    const encabezado = heads.length ? `<div style="display:flex; gap:${px(12 * u)}; align-items:stretch;"><div style="width:${px(3 * u)}; background:${acTexto}; border-radius:9999px;"></div><div style="font-size:${px(th)}; font-weight:600; line-height:1.15; color:#ffffff;">${heads.map(l => `<div style="white-space:nowrap;">${esc(l.texto)}</div>`).join('')}</div></div>` : '';
    const gigante = giants.length ? tituloExtra({ lineas: giants }, tg, acTexto, `color:${acTexto}; text-shadow:0 0 ${px(18 * u)} ${hexARgba(acTexto, 0.45)};`, { align: 'left', ls: '-0.03em', lh: 0.95 }) : '';
    const dest = c.campos.destacado.trim(), cap = c.campos.etiqueta.trim();
    const tp = Math.floor(Math.min(H * 0.1, (col - padX - 60 * u) / (Math.max(dest.length, 1) * (c.condensada ? 0.5 : 0.68))));
    const precio = dest ? `<div style="display:inline-block; border:${px(2 * u)} solid ${acTexto}; border-radius:${px(22 * u)}; background:${K}; padding:${px(10 * u)} ${px(22 * u)} ${px(12 * u)}; box-shadow:0 0 ${px(24 * u)} ${hexARgba(acTexto, 0.25)};">${cap ? `<div style="color:#ffffff; font-size:${px(13 * u)}; font-weight:600; margin-bottom:${px(2 * u)};">${esc(cap)}</div>` : ''}<div style="color:#ffffff; font-weight:800; font-style:italic; line-height:1; white-space:nowrap; font-size:${px(tp)};">${esc(dest)}</div></div>` : '';
    const cuotas = c.campos.cta.trim() ? `<div style="display:flex; align-items:center; gap:${px(8 * u)}; color:#ffffff; font-size:${px(13 * u)}; font-weight:800; line-height:1.2;"><svg width="${px(22 * u)}" height="${px(22 * u)}" viewBox="0 0 24 24" fill="none" stroke="${acTexto}" stroke-width="2" stroke-linecap="round" style="flex-shrink:0;"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/></svg><span>${esc(c.campos.cta.trim())}</span></div>` : '';
    const items = c.campos.texto.split('\n').map(s => s.trim()).filter(Boolean);
    const lista = items.length ? `<div style="display:flex; flex-direction:column; gap:${px(5 * u)};">${items.map(i => `<div style="display:flex; gap:${px(8 * u)}; align-items:flex-start; color:#e4e4e7; font-size:${px(13 * u * (c.textoZoom || 100) / 100)}; font-weight:600; line-height:1.25;"><span style="width:${px(5 * u)}; height:${px(5 * u)}; margin-top:${px(6 * u)}; border-radius:9999px; background:${acTexto}; flex-shrink:0;"></span><span>${esc(i)}</span></div>`).join('')}</div>` : '';
    const capas = (c.imagenes || []).map((im, i) => im.src
        ? `<img src="${im.src}" data-capa="${i}" data-ajuste="${im.ajuste}" draggable="false" style="position:absolute; inset:0; width:100%; height:100%; object-fit:${im.ajuste === 'llenar' ? 'cover' : 'contain'}; transform:${transformImagen(im)}; transform-origin:50% 50%; display:block; cursor:grab; touch-action:none; user-select:none; filter:drop-shadow(0 ${px(10 * u)} ${px(18 * u)} rgba(0,0,0,0.5));" />` : '').join('');
    const foto = capas || `<div style="position:absolute; inset:0; border:${px(2 * u)} dashed ${hexARgba(acTexto, 0.5)}; border-radius:${px(24 * u)}; display:flex; align-items:center; justify-content:center; color:#a1a1aa; font-size:${px(11 * u)}; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; text-align:center; padding:${px(10 * u)};">Subí la foto del producto<br>(mejor PNG sin fondo)</div>`;
    const anillo = W * 0.78;
    return marco(c, `background:${K};`, `
        <div style="position:absolute; left:0; top:0; width:55%; height:45%; ${estiloPuntos('rgba(255,255,255,0.10)', 1.3, 10)}"></div>
        <div style="position:absolute; top:-${px(W * 0.3)}; right:-${px(W * 0.3)}; width:${px(W)}; height:${px(W)}; border-radius:9999px; background:radial-gradient(closest-side, ${hexARgba(acTexto, 0.55)}, transparent);"></div>
        <div style="position:absolute; left:${px(padX * 0.5)}; top:${px(H * 0.2)}; font-size:${px(W * 0.2)}; font-weight:800; font-style:italic; text-transform:uppercase; line-height:0.9; letter-spacing:-0.03em; color:rgba(255,255,255,0.04); white-space:nowrap;">${esc(c.campos.pie.trim() || 'Dropea')}</div>
        <div style="position:absolute; z-index:1; left:${px(W * 0.68 - anillo / 2)}; top:${px(H * 0.6 - anillo * 0.3)}; width:${px(anillo)}; height:${px(anillo * 0.6)}; border-radius:9999px; border:${px(16 * u)} solid ${acTexto}; box-shadow:0 0 ${px(40 * u)} ${hexARgba(acTexto, 0.6)}, inset 0 0 ${px(30 * u)} ${hexARgba(acTexto, 0.4)}; transform:rotate(-12deg);"></div>
        <div style="position:absolute; z-index:3; left:${px(W * 0.34)}; top:${px(H * 0.28)}; width:${px(W * 0.66)}; height:${px(H * 0.5)};">${foto}</div>
        <div style="position:relative; display:flex; justify-content:center; padding:${px(24 * u)} ${padX}px 0;">${movible(c, 'logo', logoHtml(c.dropea, true, 30 * u), 'flex-shrink:0;')}</div>
        <div style="position:relative; flex:1; min-height:0; width:${px(col)}; padding:${px(H * 0.04)} 0 ${px(18 * u)} ${px(padX)}; display:flex; flex-direction:column; align-items:flex-start; gap:${px(12 * u)};">
            ${movible(c, 'titulo', `<div style="display:flex; flex-direction:column; gap:${px(8 * u)};">${encabezado}${gigante}</div>`)}
            ${movible(c, 'destacado', precio)}
            ${movible(c, 'cta', cuotas)}
            ${movible(c, 'texto', juntarColumna(u, lista, itemsHTML(c, '#e4e4e7', 13 * u, 'left')))}
            <div style="flex:1;"></div>
        </div>
        <div style="position:relative; display:flex; justify-content:center; padding:0 ${padX}px ${px(22 * u)};">${movible(c, 'pie', pieTexto(c, '#ffffff', 11))}</div>`);
}
PLANTILLAS.producto = { label: 'Producto', sub: 'Foto, precio y beneficios' };
CONSTRUCTORES.producto = flyerProducto;

// ---------- TARJETA DROPEA: exclusiva del formato Tarjeta (16:9), oscura, con QR en columna propia ----------
// Al elegirla: pasa a formato Tarjeta, activa el QR a la derecha y, si el contenido está sin tocar,
// carga un texto de presentación para comercios (se edita todo desde los campos de siempre).
function flyerTarjetaDropea(c) {
    const { W, H, u, acTexto } = c, K = NEGRO_DROPEA, padX = 40 * u;
    const tam = tamanoTitulo(c.lineas, W - padX * 2, H * 0.27, Math.min(W * 0.085, H * 0.11), c.condensada) * (c.tituloZoom || 100) / 100;
    const cta = pill(c, c.campos.cta, { bg: acTexto, color: K, size: 11, tracking: '0.16em' });
    const fila = (cta || c.campos.pie.trim()) ? `<div style="display:flex; align-items:center; gap:${px(16 * u)};">${movible(c, 'cta', cta)}${movible(c, 'pie', pieTexto(c, '#a1a1aa'))}</div>` : '';
    const txt = c.campos.texto.trim() ? `<div style="color:#d4d4d8; font-size:${px(16 * u * (c.textoZoom || 100) / 100)}; font-weight:600; line-height:1.35; max-width:${px(W * 0.8)};">${esc(c.campos.texto.trim()).replace(/\n/g, '<br>')}</div>` : '';
    let panel = '';
    if (c.qrLado) {
        const izq = c.qrLado === 'izquierda';
        const mitad = (c.f.qrTam * (c.qrZoom / 100) + 24 * u + 12) / 2;
        panel = `<div style="position:absolute; z-index:1; top:0; bottom:0; left:${izq ? '-' + px(c.reserva) : px(W)}; width:${px(c.reserva)}; background:linear-gradient(180deg, ${hexARgba(acTexto, 0.18)}, ${hexARgba(acTexto, 0.04)}); border-${izq ? 'right' : 'left'}:1px solid ${hexARgba(acTexto, 0.4)};">
            <div style="position:absolute; left:0; right:0; top:calc(50% - ${px(mitad + 52 * u)}); text-align:center; color:#ffffff; font-size:${px(13 * u)}; font-weight:800; line-height:1.3; letter-spacing:0.12em; text-transform:uppercase;">Escaneá y<br>conocé Dropea</div>
            <div style="position:absolute; left:0; right:0; top:calc(50% + ${px(mitad + 18 * u)}); display:flex; justify-content:center;">${chispa(acTexto, 20 * u)}</div>
        </div>`;
    }
    return marco(c, `background:${K};`, `
        ${glows(c)}${panel}
        ${destello(acTexto, 40 * u, `top:${px(H * 0.2)}; right:${px(30 * u)};`)}
        ${cabecera(c, true, { bg: acTexto, color: K, size: 10 })}
        <div style="position:relative; flex:1; min-height:0; padding:${px(10 * u)} ${px(padX)} ${px(28 * u)}; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; gap:${px(12 * u)};">
            ${movible(c, 'titulo', tituloExtra(c, tam, '#ffffff', resaltadoSobreNegro(c), { align: 'left' }))}
            ${movible(c, 'texto', juntarColumna(u, txt, itemsHTML(c, '#ffffff', 15 * u, 'left')))}
            ${fila}
        </div>`);
}
PLANTILLAS.tarjetadropea = {
    label: 'Tarjeta Dropea', sub: 'Presentación para comercios con QR', soloFormato: 'tarjeta',
    alElegir() {
        estado.formato = 'tarjeta';
        if (estado.titulo === ESTADO_INICIAL.titulo && estado.texto === ESTADO_INICIAL.texto) {
            Object.assign(estado, {
                etiqueta: 'Para comercios', titulo: 'Tu tienda online\n*en minutos',
                texto: 'Cargás tus productos, compartís tu link y recibís los pedidos en tu WhatsApp.',
                items: '✅ Panel simple para manejar tu stock\n✅ Sin comisiones por venta\n✅ Tu tienda online 24/7',
                cta: 'Probalo 15 días gratis', pie: 'dropea.com.ar',
            });
        }
        estado.qrActivo = true;
        if (!String(estado.qrLink || '').trim()) estado.qrLink = 'https://dropea.com.ar';
        if (estado.qrUbic === 'libre') estado.qrUbic = 'derecha';
    },
};
CONSTRUCTORES.tarjetadropea = flyerTarjetaDropea;