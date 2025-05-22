document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Animation pour les sections
    const animateSections = function() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            // Ajoute un délai croissant pour chaque section
            section.style.animationDelay = `${index * 0.1}s`;
        });
    };
    
    animateSections();

    // Intercepter les formulaires du site
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simuler une soumission de formulaire
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Envoyé !';
                submitButton.disabled = true;
                
                // Réinitialiser après 2 secondes
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    form.reset();
                }, 2000);
            }
        });
    });

    // Gestion des liens actifs dans la navigation
    const setActiveNavLink = function() {
        const currentLocation = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Si le chemin du lien correspond à la page actuelle
            if (currentLocation.endsWith(linkPath)) {
                link.classList.add('text-smash-green', 'font-semibold');
                link.classList.remove('text-gray-800');
            }
        });
    };
    
    setActiveNavLink();

    // Fonctionnalité future : slider pour les produits en vedette
    // Préparation pour implémentation ultérieure
    const setupProductSlider = function() {
        const productContainer = document.querySelector('.grid');
        if (productContainer && window.innerWidth < 768) {
            // Code pour le slider mobile à implémenter
        }
    };
    
    // Appeler la fonction et l'ajouter à un écouteur de redimensionnement
    setupProductSlider();
    window.addEventListener('resize', setupProductSlider);
});
