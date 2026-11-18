// --- AL RECARGAR, VOLVER SIEMPRE AL INICIO DE LA PAGINA ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
if (location.hash) {
    // Quita el #ancla de la URL para que el navegador no salte a esa seccion
    history.replaceState(null, '', location.pathname + location.search);
}
const irAlInicio = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
irAlInicio();
window.addEventListener('pageshow', irAlInicio);
window.addEventListener('load', irAlInicio);
// --- LÓGICA DE LA PANTALLA DE CARGA (PRELOADER) ---
const preloader = document.getElementById('preloader');
const preloaderBar = document.querySelector('.preloader-bar');

if (preloader) {
    // Bloquear el scroll mientras se muestra la pantalla de carga
    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
        // Iniciar el llenado de la barra de progreso hasta el 100% (1.8s definidos en CSS)
        if (preloaderBar) {
            requestAnimationFrame(() => {
                preloaderBar.style.width = '100%';
            });
        }

        // Esperar a que la barra llegue al 100% (1800ms) para disparar el efecto Zoom-In
        setTimeout(() => {
            preloader.classList.add('is-loaded');
            document.body.style.overflow = '';

            // Eliminar el nodo del DOM tras finalizar la transición de salida (600ms)
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }, 1800);
    });
}

const modal = document.getElementById('alfajorModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

const modalImgHover = document.getElementById('modalImgHover');

// Lógica de apertura/cierre de Modales
function openModal(title, desc, imgSrc, hoverSrc, fallbackSrc) {
    modalTitle.innerText = title;
    modalDesc.innerText = desc;

    // Si falta la foto "entero" se usa el placeholder
    modalImg.onerror = fallbackSrc ? () => { modalImg.onerror = null; modalImg.src = fallbackSrc; } : null;
    modalImg.src = imgSrc;

    if (hoverSrc) {
        // Si falta la foto "mitad", simplemente no se muestra
        modalImgHover.onerror = () => { modalImgHover.style.display = 'none'; };
        modalImgHover.style.display = '';
        modalImgHover.src = hoverSrc;
    } else {
        modalImgHover.removeAttribute('src');
        modalImgHover.style.display = 'none';
    }
    modal.classList.add('is-active');
}

function closeModal() {
    modal.classList.remove('is-active');
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// --- GENERACIÓN DE TARJETAS DESDE js/productos.js ---
const track = document.getElementById('catalog-track');

function placeholderUrl(p, w, h, texto) {
    const t = texto ? `?text=${encodeURIComponent(texto)}` : '';
    return `https://via.placeholder.com/${w}x${h}/${p.color}/${p.textoColor}${t}`;
}

function renderProductos() {
    if (!track || typeof productos === 'undefined') return;

    productos.forEach(p => {
        const base = `${RUTA_PRODUCTOS}/${p.slug}`;
        const paquete = `${base}/paquete.${EXT_IMAGENES}`;
        const entero = `${base}/entero.${EXT_IMAGENES}`;
        const mitad = `${base}/mitad.${EXT_IMAGENES}`;
        const fallbackCard = placeholderUrl(p, 300, 300, p.nombre);
        const fallbackModal = placeholderUrl(p, 400, 300);

        const card = document.createElement('div');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.className = 'product-image';
        img.alt = p.nombre;
        img.loading = 'lazy';
        img.onerror = () => { img.onerror = null; img.src = fallbackCard; };
        img.src = paquete;

        const info = document.createElement('div');
        info.className = 'product-info';
        const tag = document.createElement('span');
        tag.className = 'tag-text';
        tag.textContent = p.categoria;
        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = p.titulo;
        info.append(tag, title);

        card.append(img, info);
        card.addEventListener('click', () =>
            handleCardClick(card, p.nombre, p.desc, entero, mitad, fallbackModal));
        track.appendChild(card);
    });
}

renderProductos();

// --- LÓGICA DE CARRUSEL COVER FLOW INFINITO ---
const cards = Array.from(document.querySelectorAll('.product-card'));
let currentIndex = 0;

function updateCarousel() {
    if (cards.length === 0) return;

    // Limpiamos todas las clases posibles
    cards.forEach(card => {
        card.classList.remove('card-center', 'card-left', 'card-right', 'card-outer-left', 'card-outer-right', 'card-hidden-left', 'card-hidden-right');
    });

    const total = cards.length;
    const centerIndex = currentIndex;
    const leftIndex = (currentIndex - 1 + total) % total;
    const rightIndex = (currentIndex + 1) % total;
    
    // Nuevas tarjetas exteriores visibles
    const outerLeftIndex = (currentIndex - 2 + total) % total;
    const outerRightIndex = (currentIndex + 2) % total;
    
    // Tarjetas ocultas esperando entrar
    const hiddenLeftIndex = (currentIndex - 3 + total) % total;
    const hiddenRightIndex = (currentIndex + 3) % total;

    cards[centerIndex].classList.add('card-center');
    cards[leftIndex].classList.add('card-left');
    cards[rightIndex].classList.add('card-right');
    cards[outerLeftIndex].classList.add('card-outer-left');
    cards[outerRightIndex].classList.add('card-outer-right');
    cards[hiddenLeftIndex].classList.add('card-hidden-left');
    cards[hiddenRightIndex].classList.add('card-hidden-right');
}

function moveCarousel(direction) {
    const total = cards.length;
    currentIndex = (currentIndex + direction + total) % total;
    updateCarousel();
}

function handleCardClick(element, title, desc, img, hoverImg, fallbackImg) {
    if (element.classList.contains('card-center')) {
        openModal(title, desc, img, hoverImg, fallbackImg);
    } else if (element.classList.contains('card-left') || element.classList.contains('card-outer-left')) {
        moveCarousel(-1);
    } else if (element.classList.contains('card-right') || element.classList.contains('card-outer-right')) {
        moveCarousel(1);
    }
}

let touchStartX = 0;
let touchEndX = 0;

if (track) {
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) moveCarousel(1);
    if (touchEndX > touchStartX + 50) moveCarousel(-1);
}

// Iniciar
updateCarousel();

// --- LÓGICA DEL MAPA DE PUNTOS DE VENTA ---

const MAPA_ID = "12QEgyaIDmJbi46kq4xPyQZ0F_S_YBDk&ehbc=2E312F"; 

function centrarMapa(lat, lng) {
    const iframe = document.querySelector('.mapa-container iframe');
    if (iframe) {
        iframe.src = `https://www.google.com/maps/d/embed?mid=${MAPA_ID}&ll=${lat},${lng}&z=18`;
        
        if(window.innerWidth < 768) {
            document.querySelector('.mapa-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}


// --- EFECTO SCROLL REVEAL (AL BAJAR Y SUBIR) ---
function initScrollReveal() {
    const revealGroups = [
        { selector: '#inicio .hero-logo-container', stagger: 0 },
        { selector: '#catalogo .container h2, #catalogo .container p', stagger: 120 },
        { selector: '#catalogo .carousel-container', stagger: 0 },
        { selector: '#historia .grid-2-cols > div:first-child', stagger: 0, extraClass: 'reveal-left' },
        { selector: '#historia .grid-2-cols > div:last-child', stagger: 150, extraClass: 'reveal-right' },
        { selector: '#puntos-venta h2', stagger: 0 },
        { selector: '#puntos-venta .local-card', stagger: 100 },
        { selector: '#puntos-venta .mapa-container', stagger: 0 }
    ];

    const elementsToObserve = [];

    revealGroups.forEach(({ selector, stagger, extraClass }) => {
        const items = document.querySelectorAll(selector);
        items.forEach((el, index) => {
            el.classList.add('reveal');
            if (extraClass) {
                el.classList.add(extraClass);
            }
            if (stagger > 0) {
                el.style.setProperty('--reveal-delay', `${index * stagger}ms`);
            }
            elementsToObserve.push(el);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add('reveal-visible');
            } else {
                el.classList.remove('reveal-visible');
                if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
                    if (entry.boundingClientRect.top < 0) {
                        el.classList.add('reveal-from-top');
                    } else {
                        el.classList.remove('reveal-from-top');
                    }
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '-10% 0px -12% 0px'
    });

    elementsToObserve.forEach(el => observer.observe(el));
}

initScrollReveal();


// --- LISTÓN DE PREMIO (Historia) ---
(function initPremio() {
    const btn = document.getElementById('premioBtn');
    const info = document.getElementById('premioInfo');
    const cerrar = document.getElementById('premioCerrar');
    if (!btn || !info) return;

    function setOpen(open) {
        if (open) info.hidden = false;
        info.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (!open) info.hidden = true;
    }

    btn.addEventListener('click', e => {
        e.stopPropagation();
        setOpen(!info.classList.contains('is-open'));
    });
    cerrar.addEventListener('click', () => setOpen(false));
    document.addEventListener('click', e => {
        if (!info.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setOpen(false);
    });
})();

// --- MENÚ HAMBURGUESA (Navbar móvil) ---
(function initNavMenu() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!navbar || !toggle || !menu) return;

    function setMenu(open) {
        navbar.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }

    toggle.addEventListener('click', e => {
        e.stopPropagation();
        setMenu(!navbar.classList.contains('is-open'));
    });

    // Cerrar al elegir un enlace del menú
    menu.addEventListener('click', e => {
        if (e.target.closest('a')) setMenu(false);
    });

    // Cerrar al tocar fuera de la navbar o con Escape
    document.addEventListener('click', e => {
        if (!navbar.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setMenu(false);
    });

    // Al volver a escritorio, restablecer el estado
    window.matchMedia('(min-width: 769px)').addEventListener('change', e => {
        if (e.matches) setMenu(false);
    });
})();