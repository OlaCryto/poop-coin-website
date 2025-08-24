// Sound Logic - Original Style
document.addEventListener("DOMContentLoaded", () => {
    let isMuted = false;
    const bgMusic = document.getElementById('bg-music');
    
    isMuted = localStorage.getItem("isMuted") === "1";
    updateMuteButton();
    
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

    function toggleMute() {
        isMuted = !isMuted;
        localStorage.setItem("isMuted", isMuted ? '1' : '0');
        const bgMusic = document.getElementById('bg-music');
        if (isMuted) {
            if (bgMusic) bgMusic.pause();
        } else {
            if (bgMusic) bgMusic.play().catch(e => {});
        }
        updateMuteButton();
    }

    function updateMuteButton() {
        const btn = document.getElementById("mute-button");
        const icon = document.getElementById("mute-icon");
        if (!btn || !icon) return;
        
        btn.classList.toggle("muted", isMuted);
        btn.classList.toggle("unmuted", !isMuted);
        btn.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
        btn.setAttribute("title", isMuted ? "Unmute" : "Mute");
        
        if (isMuted) {
          // Muted SVG
          icon.innerHTML = `<svg class='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'></polygon><line x1='23' y1='9' x2='17' y2='15'></line><line x1='17' y1='9' x2='23' y2='15'></line></svg>`;
        } else {
          // Unmuted SVG
          icon.innerHTML = `<svg class='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'></polygon></svg>`;
        }
    }

    const muteButton = document.getElementById("mute-button");
    if (muteButton) {
        muteButton.addEventListener("click", toggleMute);
        muteButton.addEventListener("keydown", function(e) {
          if (e.key === "Enter" || e.key === " ") {
            toggleMute();
          }
        });
    }

    // Optional: on internal link clicks (if not full reloads)
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (!isMuted) {
                // continue playing
            } else {
                // keep sound muted
            }
        });
    });
});
