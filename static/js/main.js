// --- Global Sound Effect ---
// A single sound for all button interactions, loaded from a local file.
const buttonClickSound = new Audio('/static/sounds/fart.mp3');
// Hint to the browser to start loading the audio file immediately.
buttonClickSound.load();

// Add a click event listener to ALL buttons and links.
// This plays the sound effect on click.
document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('click', () => {
        // Resetting currentTime allows the sound to be played again quickly.
        buttonClickSound.currentTime = 0;
        buttonClickSound.play().catch(e => console.error("Button sound failed to play:", e));
    });
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


// --- Raining Poop Effect ---
function createPoop() {
    const rainContainer = document.getElementById('rain-container');
    if (!rainContainer) return; // Don't run if the container isn't on the page

    const poop = document.createElement('div');
    poop.classList.add('poop');
    poop.textContent = '💩';
    // Randomize horizontal position, animation speed, and size for a more natural look.
    poop.style.left = Math.random() * 100 + 'vw';
    poop.style.animationDuration = Math.random() * 3 + 3 + 's';
    poop.style.fontSize = Math.random() * 1 + 1.5 + 'em';
    
    rainContainer.appendChild(poop);
    
    // Remove the emoji from the DOM after its animation finishes to prevent clutter.
    setTimeout(() => poop.remove(), 6000);
}
// Call the createPoop function repeatedly to create a continuous "rain".
setInterval(createPoop, 200);


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
