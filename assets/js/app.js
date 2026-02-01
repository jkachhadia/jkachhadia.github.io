// Nav Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Canvas Animation - Adjusted for subtle background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 40; // Fewer particles for cleaner look
const connectionDistance = 100;
const mouseDistance = 150;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.baseColor = 'rgba(157, 125, 253, '; // Violet accent
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + '0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();

        // Connect particles
        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(157, 125, 253, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x != null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(93, 157, 255, ${1 - distance / mouseDistance})`; // Blue accent for interaction
                ctx.lineWidth = 0.8;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

initParticles();
animate();


// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);


document.querySelectorAll('.content-row').forEach(section => {
    observer.observe(section);
});

// --------------------------------------------------
// V13: Netflix-Style Modal Logic (Robust Dataflow)
// --------------------------------------------------
// Encapsulate in IIFE to prevent global pollution but run immediately
(() => {
    console.log('Initializing Portfolio Modal Logic...');

    const modal = document.querySelector('#detail-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    // UI Elements in Modal
    const modalTitle = document.querySelector('#modal-title');
    const modalSubtitle = document.querySelector('#modal-subtitle');
    const modalDesc = document.querySelector('#modal-desc');
    const modalLink = document.querySelector('#modal-link');
    const modalHero = document.querySelector('.modal-hero');

    // Close Modal Function
    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Open Modal Function
    const openModal = (data) => {
        if (!modal || !modalTitle) {
            console.error('Modal elements not found!');
            return;
        }

        console.log('Opening Modal with data:', data);

        // Populate Data
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalDesc.textContent = data.desc;

        // Setup CTA
        if (data.link && data.link !== '#') {
            modalLink.href = data.link;
            modalLink.style.display = 'inline-flex';
            modalLink.innerHTML = '<i class="fas fa-play"></i> ' + (data.link.includes('pdf') ? 'View Resume' : 'Open Link');
        } else {
            modalLink.style.display = 'none';
        }

        // Set Hero Image
        if (data.image && data.image !== 'none') {
            modalHero.style.backgroundImage = data.image;
        } else {
            modalHero.style.backgroundImage = 'linear-gradient(to bottom, #2a2a2a, #181818)';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    // Event Delegation for Card Clicks
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.poster-card, .brand-card');

        // If NOT a card, or if it's inside the modal itself, ignore
        if (!card || e.target.closest('.modal-card')) return;

        e.preventDefault();

        // Extract Data from DATA attributes (Primary Source)
        const d = card.dataset;

        // Fallbacks for older tiles without data attributes
        const title = d.title || card.querySelector('h4, .stat-big, .brand-title')?.textContent || 'Untitled';
        const subtitle = d.subtitle || card.querySelector('.year, .top-badge')?.textContent || '2026';
        const desc = d.desc || card.querySelector('p, .stat-detail')?.textContent || 'Click to view more details about this item.';
        const link = d.link || card.closest('a')?.href || '#';

        // Extract Image (Computed Style from the zoom target)
        // Ensure we check if the element exists before getting style
        let image = null;
        const bgTarget = card.querySelector('.bg-zoom-target') || card;
        if (bgTarget) {
            const style = window.getComputedStyle(bgTarget);
            image = style.backgroundImage;
        }

        openModal({ title, subtitle, desc, image, link });
    });

    // Close Event Listeners checks
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {

        // --- INTRO & PROFILE GATE LOGIC ---
        const introOverlay = document.getElementById('intro-overlay');
        const introAnimation = document.getElementById('intro-animation');
        const profileGate = document.getElementById('profile-gate');
        const body = document.body;

        // 1. Lock Scroll initially
        if (introOverlay) {
            body.classList.add('noscroll');

            // 2. Sequence the Intro
            // The CSS animation 'cinematic-intro' takes 3s.
            // At 2.5s, we start fading out the text and bringing in profiles.
            setTimeout(() => {
                introAnimation.style.display = 'none'; // distinct step
                profileGate.classList.remove('hidden'); // allow display

                // Small reflow hack to ensure transition triggers
                void profileGate.offsetWidth;

                profileGate.classList.add('active'); // trigger fade in
            }, 2800); // slightly before 3s end
        }

        // 3. Profile Click Handler (Exposed globally)
        window.enterSite = function (profileName) {
            console.log("Welcome, " + profileName);

            // Fade out overlay
            introOverlay.style.opacity = '0';

            // Remove overlay after fade
            setTimeout(() => {
                introOverlay.style.display = 'none';
                body.classList.remove('noscroll'); // Unlock scroll
            }, 800);
        };

        // --- END INTRO LOGIC ---

        if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
    });

})();
