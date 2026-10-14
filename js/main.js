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

    cards.forEach(card => {
        card.classList.remove('card-center', 'card-left', 'card-right', 'card-hidden-left', 'card-hidden-right');
    });

    const total = cards.length;
    const centerIndex = currentIndex;
    const leftIndex = (currentIndex - 1 + total) % total;
    const rightIndex = (currentIndex + 1) % total;
    const hiddenLeftIndex = (currentIndex - 2 + total) % total;
    const hiddenRightIndex = (currentIndex + 2) % total;

    cards[centerIndex].classList.add('card-center');
    cards[leftIndex].classList.add('card-left');
    cards[rightIndex].classList.add('card-right');
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
    } else if (element.classList.contains('card-left')) {
        moveCarousel(-1);
    } else if (element.classList.contains('card-right')) {
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