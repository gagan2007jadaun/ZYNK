function renderSidebar(activePage) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const items = [
        { name: 'Feed', icon: 'home', href: 'feed.html' },
        { name: 'Explore', icon: 'search', href: 'explore.html' },
        { name: 'Chat', icon: 'message-circle', href: 'chat.html' },
        { name: 'Notifications', icon: 'bell', href: 'notifications.html' },
        { name: 'Topics', icon: 'hash', href: 'topics.html' },
        { name: 'Bookmarks', icon: 'bookmark', href: 'bookmarks.html' },
        { name: 'Profile', icon: 'user', href: 'profile.html' },
        { name: 'More', icon: 'more-horizontal', href: 'more.html' },
        { name: 'Settings', icon: 'settings', href: 'settings.html' },
    ];

    let html = items.map(item => {
        const isActive = item.name.toLowerCase() === activePage.toLowerCase() ? 'active' : '';
        return `
            <a href="${item.href}" class="side-item ${isActive}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.name}</span>
            </a>
        `;
    }).join('');

    // Add Logout
    html += `
        <a href="auth.html" class="side-item" style="color:#ff4d4d">
            <i data-lucide="log-out"></i>
            <span>Logout</span>
        </a>
    `;

    // Add Theme Toggle
    html += `
        <button id="themeToggle" class="side-item w-full">
            <i data-lucide="moon"></i>
            <span>Theme</span>
        </button>
    `;

    sidebar.innerHTML = html;

    // Attach Theme Toggle Listener
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = theme.toggle();
            // Update icon if needed - currently always 'moon' per design, 
            // but we could switch to 'sun' if requested.
            // For now, just ensuring the toggle works is the priority.
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    } else {
        console.warn('Lucide icons not loaded yet, retrying...');
        const script = document.querySelector('script[src*="lucide"]');
        if (script) {
            script.addEventListener('load', () => window.lucide.createIcons());
        }
        // Fallback retry
        setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
        }, 1000);
    }

    // Re-attach theme toggle listener if needed, but since we just replaced the button, 
    // we need to make sure the event listener in the main file can find it.
    // The main file script runs AFTER this usually, or we need to dispatch an event.
    // However, in settings.html, the script is at the bottom. 
    // If renderSidebar is called in head or body top, the bottom script will find the new button.
    // If renderSidebar is called at bottom, well...
}
