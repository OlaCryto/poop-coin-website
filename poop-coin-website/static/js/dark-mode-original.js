// Dark Mode Logic - Enhanced to match extended homepage
document.addEventListener('DOMContentLoaded', function() {
    const bodyRoot = document.getElementById('body-root');
    const darkToggle = document.getElementById('dark-mode-toggle');
    
    function setDarkMode(enabled) {
        if (enabled) {
            // Add Tailwind dark mode class to HTML element
            document.documentElement.classList.add('dark');
            // Add enhanced dark styling to match extended homepage
            bodyRoot.classList.add('dark', 'bg-gray-900', 'text-gray-100');
            darkToggle.textContent = '☀️'; // Sun icon for light mode
        } else {
            // Remove Tailwind dark mode class from HTML element
            document.documentElement.classList.remove('dark');
            // Remove dark styling
            bodyRoot.classList.remove('dark', 'bg-gray-900', 'text-gray-100');
            darkToggle.textContent = '🌙'; // Moon icon for dark mode
        }
        localStorage.setItem('darkMode', enabled ? '1' : '0');
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            setDarkMode(!document.documentElement.classList.contains('dark'));
        });
    }

    // Set mode from localStorage on page load
    if (localStorage.getItem('darkMode') === '1') {
        setDarkMode(true);
    }
});
