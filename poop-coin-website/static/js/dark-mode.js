// Dark Mode Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dark mode script loaded');
    
    const bodyRoot = document.getElementById('body-root');
    const darkToggle = document.getElementById('dark-mode-toggle');
    const mobileDarkToggle = document.getElementById('mobile-dark-toggle');
    
    console.log('Dark mode elements found:', {bodyRoot, darkToggle, mobileDarkToggle});
    
    function setDarkMode(enabled) {
        console.log('Setting dark mode:', enabled);
        if (enabled) {
            document.documentElement.classList.add('dark');
            if (bodyRoot) {
                bodyRoot.classList.add('dark', 'bg-gray-900', 'text-gray-100');
            }
            if (darkToggle) {
                darkToggle.textContent = '☀️'; // Sun icon for light mode
            }
            if (mobileDarkToggle) {
                mobileDarkToggle.textContent = '☀️'; // Sun icon for light mode
            }
            console.log('Dark mode classes added');
        } else {
            document.documentElement.classList.remove('dark');
            if (bodyRoot) {
                bodyRoot.classList.remove('dark', 'bg-gray-900', 'text-gray-100');
            }
            if (darkToggle) {
                darkToggle.textContent = '🌙'; // Moon icon for dark mode
            }
            if (mobileDarkToggle) {
                mobileDarkToggle.textContent = '🌙'; // Moon icon for dark mode
            }
            console.log('Dark mode classes removed');
        }
        localStorage.setItem('darkMode', enabled ? '1' : '0');
    }

    function toggleDarkMode() {
        console.log('Dark mode button clicked');
        const isDark = document.documentElement.classList.contains('dark');
        setDarkMode(!isDark);
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDarkMode();
        });
        console.log('Dark mode event listener added');
    } else {
        console.error('Dark mode toggle button not found!');
    }

    if (mobileDarkToggle) {
        mobileDarkToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDarkMode();
        });
        console.log('Mobile dark mode event listener added');
    }

    // Set mode from localStorage on page load
    if (localStorage.getItem('darkMode') === '1') {
        console.log('Loading dark mode from localStorage');
        setDarkMode(true);
    }
});
