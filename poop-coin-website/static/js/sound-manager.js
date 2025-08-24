// Sound Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sound script loaded');
    
    const soundToggle = document.getElementById('sound-toggle');
    const mobileSoundToggle = document.getElementById('mobile-sound-toggle');
    const muteButton = document.getElementById('mute-button');
    
    console.log('Sound controls found:', {soundToggle, mobileSoundToggle, muteButton});
    
    // Global mute state - unified with main.js
    let isMuted = localStorage.getItem('isMuted') === '1';
    
    function updateSoundControls() {
        // Update simple sound toggle
        if (soundToggle) {
            soundToggle.textContent = isMuted ? '🔇' : '🔊';
        }
        
        // Update mobile sound toggle
        if (mobileSoundToggle) {
            mobileSoundToggle.textContent = isMuted ? '🔇' : '🔊';
        }
        
        // Update mute button
        if (muteButton) {
            const icon = muteButton.querySelector('#mute-icon');
            const tooltip = muteButton.querySelector('#mute-tooltip');
            
            muteButton.classList.toggle("muted", isMuted);
            muteButton.classList.toggle("unmuted", !isMuted);
            muteButton.setAttribute("aria-label", isMuted ? "Unmute sounds" : "Mute sounds");
            
            if (tooltip) {
                tooltip.textContent = isMuted ? "Click to unmute sounds" : "Click to mute sounds";
            }
            
            if (icon) {
                if (isMuted) {
                    // Muted SVG
                    icon.innerHTML = `<svg class='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'></polygon><line x1='23' y1='9' x2='17' y2='15'></line><line x1='17' y1='9' x2='23' y2='15'></line></svg>`;
                } else {
                    // Unmuted SVG
                    icon.innerHTML = `<svg class='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'></polygon></svg>`;
                }
            }
        }
    }
    
    function toggleSound() {
        console.log('Sound toggle clicked');
        isMuted = !isMuted;
        localStorage.setItem('isMuted', isMuted ? '1' : '0');
        updateSoundControls();
        
        // Handle background music
        const bgMusic = document.getElementById('bg-music');
        if (isMuted) {
            if (bgMusic) bgMusic.pause();
        } else {
            if (bgMusic) bgMusic.play().catch(e => {});
        }
        
        console.log('Sound muted:', isMuted);
    }
    
    // Sound toggle functionality
    if (soundToggle) {
        soundToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSound();
        });
        console.log('Sound toggle event listener added');
    }
    
    // Mobile sound toggle
    if (mobileSoundToggle) {
        mobileSoundToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSound();
        });
        console.log('Mobile sound toggle event listener added');
    }
    
    // Mute button functionality
    if (muteButton) {
        muteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSound();
        });
        console.log('Mute button event listener added');
    }
    
    // Initialize sound controls state
    updateSoundControls();
    
    // Make mute state globally accessible
    window.isSoundMuted = function() {
        return isMuted;
    };
    
    // Background music initialization
    document.addEventListener("DOMContentLoaded", () => {
        const bgMusic = document.getElementById('bg-music');
        
        if (!isMuted && bgMusic) {
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    console.log("Autoplay blocked. Will play on user interaction.");
                });
            }
        }
        
        // On first user interaction, load audio if not loaded
        function loadAudio() {
            if (bgMusic && bgMusic.preload !== "auto") {
                bgMusic.preload = "auto";
                bgMusic.load();
                if (!isMuted) {
                    bgMusic.play().catch(() => {});
                }
            }
        }
        window.addEventListener("click", loadAudio, { once: true });
        window.addEventListener("touchstart", loadAudio, { once: true });
    });
});
