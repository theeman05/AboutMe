document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. INTERSECTION OBSERVER (Infinite Scroll Animations)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When it enters the screen, slide it in
                entry.target.classList.add('is-visible');
            } else {
                // When it leaves the screen, remove the class to slide it back out
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[class*="reveal-"]');
    animatedElements.forEach(el => scrollObserver.observe(el));


    /* =========================================
       2. MODAL VARIABLES & SETUP
       ========================================= */
    // Elements for both modals
    const allModals = document.querySelectorAll('.lightbox-modal');
    const allCloseBtns = document.querySelectorAll('.lightbox-close');

    // Image Gallery specific elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.masonry-item img, .project-media img');

    // Project Modal specific elements
    const projectModal = document.getElementById('project-modal');
    const modalTitleBox = document.getElementById('modal-title');
    const modalBodyBox = document.getElementById('modal-body');
    const projectTriggers = document.querySelectorAll('.project-modal-trigger');

    /* =========================================
       3. OPENING LOGIC
       ========================================= */

    // Open Image Gallery
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.closest('.project-modal-trigger')) {
                return;
            }

            // Otherwise, it's a normal image, so open the standard lightbox
            e.preventDefault(); // Stop bubbling just in case
            lightbox.classList.add('active');
            lightboxImg.src = e.target.src;
            document.body.style.overflow = 'hidden';
        });
    });

    // Open Project Details
    projectTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the click from bubbling up further

            const title = btn.getAttribute('data-title');
            const content = btn.getAttribute('data-content');

            modalTitleBox.innerText = title;
            modalBodyBox.innerHTML = content;

            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    /* =========================================
       4. UNIVERSAL CLOSING LOGIC
       ========================================= */
    // Master close function
    const closeModal = (modalToClose) => {
        if (!modalToClose) return;

        // INSTANTLY KILL AUDIO/VIDEO
        const iframes = modalToClose.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.src = '';
        });

        modalToClose.classList.remove('active');

        setTimeout(() => {
            if (!modalToClose.classList.contains('active')) {
                // Clean up specific to the modal type
                if (modalToClose.id === 'lightbox') {
                    lightboxImg.src = '';
                } else if (modalToClose.id === 'project-modal') {
                    modalTitleBox.innerText = '';
                    modalBodyBox.innerHTML = '';
                }
                document.body.style.overflow = 'auto';
            }
        }, 300);
    };

    // Trigger close on "X" click
    allCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentModal = this.closest('.lightbox-modal');
            closeModal(parentModal);
        });
    });

    // Trigger close on background click
    allModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Trigger close on 'Escape' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.lightbox-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    /* =========================================
       5. INFINITE MARQUEE CLONE ENGINE
       ========================================= */
    const marqueeTrack = document.getElementById('marquee-track');

    if (marqueeTrack) {
        // Grab all the original list items
        const marqueeItems = Array.from(marqueeTrack.children);

        // We will clone the entire set 3 times to ensure it fills even ultrawide 4K monitors
        for (let i = 0; i < 3; i++) {
            marqueeItems.forEach(item => {
                const clone = item.cloneNode(true); // Deep clone the <li>
                clone.setAttribute('aria-hidden', 'true'); // Hide from screen readers
                marqueeTrack.appendChild(clone); // Add it to the end of the track
            });
        }
    }

    /* =========================================
       6. DYNAMIC STAGGERED DELAYS (Masonry Gallery)
       ========================================= */
    const masonryItems = document.querySelectorAll('.masonry-item');

    masonryItems.forEach((item, index) => {
        // Multiplies the index by 0.15 seconds to create a perfect, mathematically even cascade
        // e.g., Item 1: 0s, Item 2: 0.15s, Item 3: 0.30s, etc.
        item.style.transitionDelay = `${index * 0.15}s`;
    });

    /* =========================================
       DYNAMIC HERO VIDEO & POSTER SWITCHER
       ========================================= */
    const heroVideo = document.getElementById('hero-video');

    if (heroVideo) {
        // Track the current state to prevent infinite reloading
        let currentlyDesktop = window.innerWidth >= 1024;

        const setVideoSource = (isInitialLoad = false) => {
            const isDesktop = window.innerWidth >= 1024;

            // Only swap the video if the screen type changed, or if it's the very first load
            if (isDesktop !== currentlyDesktop || isInitialLoad) {
                currentlyDesktop = isDesktop;

                if (isDesktop) {
                    heroVideo.poster = "assets/images/marcy-landscape-poster.jpg";
                    heroVideo.src = "assets/videos/marcy-landscape.mp4";
                } else {
                    heroVideo.poster = "assets/images/marcy-portrait-poster.jpg";
                    heroVideo.src = "assets/videos/marcy-portrait.mp4";
                }

                // Force the browser to load the new file
                heroVideo.load();

                // Ensure it plays after loading
                heroVideo.play().catch(error => {
                    console.log("Autoplay prevented by browser:", error);
                });
            }
        };

        // 1. Run immediately when the script loads
        setVideoSource(true);

        // 2. Listen for window resizing
        window.addEventListener('resize', () => {
            setVideoSource(false);
        });
    }

    /* =========================================
   CLICK TO COPY WITH DYNAMIC TEXT
   ========================================= */
    const emailBtn = document.getElementById('copy-email');
    const btnText = emailBtn?.querySelector('.btn-text');
    const tooltip = document.getElementById('email-tooltip'); // Grab the tooltip directly

    if (emailBtn && btnText && tooltip) {
        const originalText = "Get in Touch";
        const hoverText = "Copy Email to Clipboard";
        const email = emailBtn.getAttribute('data-email');

        // 1. Change text on Hover
        emailBtn.addEventListener('mouseenter', () => {
            if (!emailBtn.classList.contains('copied')) {
                btnText.textContent = hoverText;
            }
        });

        // 2. Revert text on Mouse Leave
        emailBtn.addEventListener('mouseleave', () => {
            if (!emailBtn.classList.contains('copied')) {
                btnText.textContent = originalText;
            }
        });

        // 3. Handle the Click & Copy
        emailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(email).then(() => {
                // Visual feedback
                emailBtn.classList.add('copied');
                btnText.textContent = "Copied!";
                tooltip.classList.add('show-tooltip'); // Show the tooltip

                // Reset after 2 seconds
                setTimeout(() => {
                    emailBtn.classList.remove('copied');
                    tooltip.classList.remove('show-tooltip'); // Hide the tooltip

                    // Check if mouse is still hovering to decide text
                    btnText.textContent = emailBtn.matches(':hover') ? hoverText : originalText;
                }, 2000);
            });
        });
    }

});