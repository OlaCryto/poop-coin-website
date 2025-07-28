// --- Global Button Sound Effect ---
const buttonClickSound = new Audio('/static/sounds/fart.mp3');
buttonClickSound.load();

document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('click', () => {
        buttonClickSound.currentTime = 0;
        buttonClickSound.play().catch(e => console.error("Button sound failed to play:", e));
    });
});


// --- Background Music Control ---
const bgMusic = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');
let musicHasStarted = false;

document.body.addEventListener('click', () => {
    if (!musicHasStarted && bgMusic) {
        bgMusic.play().catch(e => console.error("Background music failed to start:", e));
        musicHasStarted = true;
    }
}, { once: true });

if (musicControl) {
    musicControl.addEventListener('click', (e) => {
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
    if (!rainContainer) return;

    const poop = document.createElement('div');
    poop.classList.add('poop');
    poop.textContent = '💩';
    poop.style.left = Math.random() * 100 + 'vw';
    poop.style.animationDuration = Math.random() * 3 + 3 + 's';
    poop.style.fontSize = Math.random() * 1 + 1.5 + 'em';
    
    rainContainer.appendChild(poop);
    setTimeout(() => poop.remove(), 6000);
}
setInterval(createPoop, 200);


// --- Web3 Wallet Connection Logic ---
const connectButton = document.getElementById('connect-wallet');
const walletStatus = document.getElementById('wallet-status');
let provider, signer, userAddress;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();

            if (walletStatus) {
                walletStatus.textContent = `Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`;
            }

            const { chainId } = await provider.getNetwork();
            if (chainId !== 43114) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xa86a' }],
                    });
                } catch (switchError) {
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
        if (walletStatus) walletStatus.textContent = 'MetaMask not detected. Please install it!';
        return null;
    }
}

if (connectButton) {
    connectButton.addEventListener('click', connectWallet);
}


// --- Mobile Menu Toggle ---
(function() {
    const tryToggle = () => {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const iconOpen = document.getElementById('icon-open');
        const iconClose = document.getElementById('icon-close');

        if (menuButton && mobileMenu && iconOpen && iconClose) {
            menuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                iconOpen.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            });
        }
    };

    if (document.readyState !== 'loading') {
        tryToggle();
    } else {
        document.addEventListener('DOMContentLoaded', tryToggle);
    }
})();
