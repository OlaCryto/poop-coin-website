// Unified Menu Management - Desktop hover, Mobile click (same appearance)
(function () {
    let mobileMenuOpen = false;
    let desktopMenuOpen = false;

    function initDesktopMenu() {
        const trigger = document.getElementById('desktop-menu-trigger');
        const dropdown = document.getElementById('menu-dropdown');
        
        if (!trigger || !dropdown) return;
        
        // Desktop uses click for better consistency
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            desktopMenuOpen = !desktopMenuOpen;
            updateDesktopMenuState(dropdown);
        });
        
        // Close desktop menu on outside click
        document.addEventListener('click', function (e) {
            if (desktopMenuOpen && !dropdown.contains(e.target) && e.target !== trigger) {
                desktopMenuOpen = false;
                updateDesktopMenuState(dropdown);
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', function (e) {
            if (desktopMenuOpen && e.key === 'Escape') {
                desktopMenuOpen = false;
                updateDesktopMenuState(dropdown);
            }
        });
    }

    function updateDesktopMenuState(dropdown) {
        if (desktopMenuOpen) {
            dropdown.classList.remove('opacity-0', 'pointer-events-none');
            dropdown.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            dropdown.classList.add('opacity-0', 'pointer-events-none');
            dropdown.classList.remove('opacity-100', 'pointer-events-auto');
        }
    }

    function initMobileMenu() {
        const trigger = document.getElementById('mobile-menu-trigger');
        const dropdown = document.getElementById('mobile-menu-dropdown');
        
        if (!trigger || !dropdown) {
            console.log('Mobile menu elements not found');
            return;
        }
        
        console.log('Initializing mobile menu...');
        
        // Mobile menu click handler
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            mobileMenuOpen = !mobileMenuOpen;
            updateMobileMenuState(dropdown);
        });
        
        // Touch support for mobile
        trigger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button touched');
            mobileMenuOpen = !mobileMenuOpen;
            updateMobileMenuState(dropdown);
        }, { passive: false });
        
        // Close mobile menu on outside click
        document.addEventListener('click', function(e) {
            if (mobileMenuOpen && !dropdown.contains(e.target) && e.target !== trigger) {
                mobileMenuOpen = false;
                updateMobileMenuState(dropdown);
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuOpen) {
                mobileMenuOpen = false;
                updateMobileMenuState(dropdown);
            }
        });
        
        // Close mobile menu when clicking regular menu links (but not control buttons)
        const menuLinks = dropdown.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Mobile menu link clicked, closing menu');
                mobileMenuOpen = false;
                updateMobileMenuState(dropdown);
            });
        });
        
        // Handle mobile control buttons inside the menu
        initMobileControls();
        
        console.log('Mobile menu initialized successfully');
    }

    function initMobileControls() {
        // Mobile dark mode toggle
        const mobileDarkToggle = document.getElementById('mobile-dark-mode-toggle');
        const desktopDarkToggle = document.getElementById('dark-mode-toggle');
        
        if (mobileDarkToggle && desktopDarkToggle) {
            mobileDarkToggle.addEventListener('click', function(e) {
                e.stopPropagation(); // Don't close menu when clicking controls
                // Trigger the same functionality as desktop toggle
                desktopDarkToggle.click();
                console.log('Mobile dark mode toggled');
            });
        }
        
        // Mobile mute button
        const mobileMuteButton = document.getElementById('mobile-mute-button');
        const desktopMuteButton = document.getElementById('mute-button');
        
        if (mobileMuteButton && desktopMuteButton) {
            mobileMuteButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Don't close menu when clicking controls
                // Trigger the same functionality as desktop mute button
                desktopMuteButton.click();
                console.log('Mobile mute toggled');
            });
            
            // Sync the mobile button state with desktop button
            const syncMuteButtonState = function() {
                const mobileIcon = document.getElementById('mobile-mute-icon');
                const desktopIcon = document.getElementById('mute-icon');
                if (mobileIcon && desktopIcon) {
                    mobileIcon.innerHTML = desktopIcon.innerHTML;
                }
                
                // Sync classes
                if (desktopMuteButton.classList.contains('muted')) {
                    mobileMuteButton.classList.add('muted');
                    mobileMuteButton.classList.remove('unmuted');
                } else {
                    mobileMuteButton.classList.add('unmuted');
                    mobileMuteButton.classList.remove('muted');
                }
            };
            
            // Initial sync
            syncMuteButtonState();
            
            // Sync when desktop button changes
            const observer = new MutationObserver(syncMuteButtonState);
            observer.observe(desktopMuteButton, { 
                attributes: true, 
                attributeFilter: ['class'],
                childList: true,
                subtree: true
            });
        }
    }

    function updateMobileMenuState(dropdown) {
        if (mobileMenuOpen) {
            dropdown.classList.remove('opacity-0', 'pointer-events-none');
            dropdown.classList.add('opacity-100', 'pointer-events-auto');
            console.log('Mobile menu opened');
        } else {
            dropdown.classList.add('opacity-0', 'pointer-events-none');
            dropdown.classList.remove('opacity-100', 'pointer-events-auto');
            console.log('Mobile menu closed');
        }
    }

    // Initialize both menus when DOM is ready
    if (document.readyState !== 'loading') {
        initDesktopMenu();
        initMobileMenu();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            initDesktopMenu();
            initMobileMenu();
        });
    }
})();
