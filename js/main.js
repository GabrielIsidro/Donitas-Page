const modal = document.getElementById('alfajorModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

// Lógica de apertura/cierre de Modales
function openModal(title, desc, imgSrc) {
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modalImg.src = imgSrc;
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

// --- LÓGICA DE CARRUSEL COVER FLOW INFINITO ---
const cards = Array.from(document.querySelectorAll('.product-card'));
const track = document.getElementById('catalog-track');
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

function handleCardClick(element, title, desc, img) {
    if (element.classList.contains('card-center')) {
        openModal(title, desc, img);
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
