// --- Global Sound Effect ---
// Multiple meme sounds for button interactions
const soundEffects = [
    new Audio('/static/sounds/fart.mp3'),
    // Add more sounds here when available
];

// Special sound effects for specific actions
const specialSounds = {
    splash: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSs='),
    pop: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBDGO1/LNeSs=')
};

// Preload all sounds
soundEffects.forEach(sound => {
    sound.load();
    sound.volume = 0.3; // Set volume to 30% so it's not too loud
});

Object.values(specialSounds).forEach(sound => {
    sound.load();
    sound.volume = 0.4;
});

// --- Unified Mute Logic (shared with base.html) ---
let isMuted = localStorage.getItem('isMuted') === '1';
// Make it globally accessible for base.html
window.isMuted = isMuted;

// Update global variable when localStorage changes
function updateGlobalMute() {
    isMuted = localStorage.getItem('isMuted') === '1';
    window.isMuted = isMuted;
}

function playButtonSound() {
    // Check current mute state from localStorage to sync with base.html
    updateGlobalMute();
    if (!isMuted && soundEffects.length > 0) {
        // Pick a random sound for variety (or just use the first one if only one exists)
        const randomSound = soundEffects[Math.floor(Math.random() * soundEffects.length)];
        randomSound.currentTime = 0;
        randomSound.play().catch(e => console.error("Button sound failed to play:", e));
    }
}

function playSpecialSound(soundType) {
    // Check current mute state from localStorage to sync with base.html
    updateGlobalMute();
    if (!isMuted && specialSounds[soundType]) {
        specialSounds[soundType].currentTime = 0;
        specialSounds[soundType].play().catch(e => console.error(`Special sound ${soundType} failed to play:`, e));
    }
}

// Only add sound to elements with 'plays-sound' class for better control
document.querySelectorAll('.plays-sound').forEach(el => {
    el.addEventListener('click', function(e) {
        // Check for special sound types
        if (el.textContent.toLowerCase().includes('discord') || el.getAttribute('title')?.toLowerCase().includes('discord')) {
            playSpecialSound('pop');
        } else if (el.href?.includes('arena') || el.getAttribute('title')?.toLowerCase().includes('arena')) {
            playSpecialSound('splash');
        } else {
            playButtonSound();
        }
    });
});

// Also add a fun sound effect for scroll-to-top button when it appears
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', playButtonSound);
    }
});


// --- Background Music Control ---
const bgMusic = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');
let musicHasStarted = false;

// Modern browsers often block autoplay. This ensures music starts only after the first user interaction.
document.body.addEventListener('click', () => {
    if (!musicHasStarted && bgMusic) {
        bgMusic.play().catch(e => console.error("Background music failed to start:", e));
        musicHasStarted = true;
    }
}, { once: true }); // The event listener removes itself after the first click.

// Add functionality to the mute/unmute button.
if (musicControl) {
    musicControl.addEventListener('click', (e) => {
        // Stop the event from bubbling up to the body, which would replay the fart sound.
        e.stopPropagation(); 
        if (bgMusic.paused) {
            bgMusic.play();
            musicControl.textContent = 'Mute Music 🔇';
        } else {
            bgMusic.pause();
            musicControl.textContent = 'Play Music 🔊';
        }
    });
}
// --- Mute/Unmute Functions ---
function muteAllSounds() {
    isMuted = true;
    localStorage.setItem('isMuted', '1');
    if (bgMusic) bgMusic.pause();
}

function unmuteAllSounds() {
    isMuted = false;
    localStorage.setItem('isMuted', '0');
    if (bgMusic) bgMusic.play().catch(() => {});
}

// Listen for mute button (from base.html)
const muteButton = document.getElementById('mute-button');
if (muteButton) {
    muteButton.addEventListener('click', () => {
        if (isMuted) {
            unmuteAllSounds();
        } else {
            muteAllSounds();
        }
    });
}

// Prevent background music from playing if muted
document.body.addEventListener('click', () => {
    if (!musicHasStarted && bgMusic && !isMuted) {
        bgMusic.play().catch(e => console.error("Background music failed to start:", e));
        musicHasStarted = true;
    }
}, { once: true });


// --- Raining Poop Effect ---
function createPoop() {
    const rainContainer = document.getElementById('rain-container');
    if (!rainContainer) return; // Don't run if the container isn't on the page

    const poop = document.createElement('div');
    poop.classList.add('poop');
    poop.textContent = '💩';
    // Randomize horizontal position, animation speed, and size for a more natural look.
    poop.style.left = Math.random() * 100 + 'vw';
    poop.style.animationDuration = Math.random() * 4 + 4 + 's'; // Slightly longer duration for extended page
    poop.style.fontSize = Math.random() * 1 + 1.5 + 'em';
    
    rainContainer.appendChild(poop);
    
    // Remove the emoji from the DOM after its animation finishes to prevent clutter.
    setTimeout(() => poop.remove(), 8000); // Longer timeout for longer animation
}
// Call the createPoop function repeatedly to create a continuous "rain" - more frequent for better coverage
setInterval(createPoop, 150); // Reduced interval for more poop


// --- Web3 Wallet Connection Logic (using ethers.js) ---
const connectButton = document.getElementById('connect-wallet');
const walletStatus = document.getElementById('wallet-status');
let provider;
let signer;
let userAddress;

async function connectWallet() {
    // Check if a wallet extension like MetaMask is installed.
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Initialize ethers provider with the browser's wallet.
            provider = new ethers.providers.Web3Provider(window.ethereum);
            // Request access to the user's accounts.
            await provider.send('eth_requestAccounts', []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();

            // Update the UI to show the connected address.
            if (walletStatus) {
                walletStatus.textContent = `Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`;
            }

            // The global click listener attached earlier already handles playing the sound.

            // Check if the user is on the correct network (Avalanche C-Chain).
            const { chainId } = await provider.getNetwork();
            if (chainId !== 43114) { // Avalanche C-Chain
                // If not on Avalanche, try to switch to it.
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xa86a' }], // 43114 in hex
                    });
                } catch (switchError) {
                    // If the network isn't added to the user's wallet, prompt them to add it.
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0xa86a',
                                chainName: 'Avalanche C-Chain',
                                nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
                                rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                                blockExplorerUrls: ['https://snowtrace.io/']
                            }],
                        });
                    } else {
                        throw switchError;
                    }
                }
            }
            return userAddress;
        } catch (error) {
            console.error("Wallet connection error:", error);
            if (walletStatus) walletStatus.textContent = `Error: ${error.message}`;
            return null;
        }
    } else {
        // If no wallet is detected, inform the user.
        if (walletStatus) walletStatus.textContent = 'MetaMask not detected. Please install it!';
        return null;
    }
}

// Attach the connectWallet function to the button's click event.
if (connectButton) {
    connectButton.addEventListener('click', connectWallet);
}

// --- Mobile Menu Toggle Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });
        // Optional: Hide menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
});

// --- Enhanced Smooth Scrolling ---
// Enhanced smooth scrolling with easing for all internal links
function initSmoothScrolling() {
    // Select all links that start with # (internal page links)
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate offset to account for fixed navbar
                const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20; // Extra 20px padding
                
                // Custom smooth scroll with easing
                smoothScrollTo(targetPosition, 800); // 800ms duration
            }
        });
    });
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    // Easing function (ease-out cubic)
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Smooth scroll to top function
function scrollToTop() {
    smoothScrollTo(0, 600);
}

// Add scroll-to-top button functionality if it exists
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', scrollToTop);
        
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.pointerEvents = 'none';
            }
        });
    }
}

// Initialize smooth scrolling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initScrollToTop();
});

// Utility function to scroll to any element by ID
function scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const targetPosition = element.offsetTop - offset;
        smoothScrollTo(targetPosition);
    }
}
