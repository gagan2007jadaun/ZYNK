function renderSidebar(activePage) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const items = [
        { name: 'Feed', icon: 'home', href: 'feed.html' },
        { name: 'Discover', icon: 'search', href: 'explore.html' },
        { name: 'Chat', icon: 'message-circle', href: 'chat.html' },
        { name: 'Ping', icon: 'bell', href: 'notifications.html' },
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

    // Add Theme Toggle (with animation style)
    const isDark = document.documentElement.classList.contains('dark');
    const initialIcon = isDark ? 'moon' : 'sun';

    html += `
        <style>
            /* Sidebar Item Styles */
            .side-item {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 10px 14px;
                border-radius: 999px;
                cursor: pointer;
                transition: background .2s;
                text-decoration: none;
                color: inherit;
            }
            .side-item:hover {
                background: #e5e7eb;
            }
            html.dark .side-item:hover {
                background: #141414;
            }
            .side-item.active {
                color: #12e6e6;
            }
            
            /* Icon Zoom on Hover */
            .side-item svg {
                transition: transform 0.2s ease;
            }
            .side-item:hover svg {
                transform: scale(1.1);
            }

            /* Theme Toggle Animation */
            @keyframes spin-scale {
                0% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(0.8) rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); }
            }
            .theme-animate {
                animation: spin-scale 0.5s ease-in-out;
            }
        </style>
        <button id="themeToggle" class="side-item w-full">
            <div id="themeIconWrap" class="flex items-center justify-center">
                <i data-lucide="${initialIcon}"></i>
            </div>
            <span>Theme</span>
        </button>
    `;

    sidebar.innerHTML = html;

    // Attach Theme Toggle Listener
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const wrapper = document.getElementById('themeIconWrap');
            wrapper.classList.add('theme-animate');

            // Toggle logic
            const isDark = theme.toggle();
            const newIcon = isDark ? 'moon' : 'sun';

            // Wait for half animation to swap icon
            setTimeout(() => {
                wrapper.innerHTML = `<i data-lucide="${newIcon}"></i>`;
                if (window.lucide) {
                    window.lucide.createIcons({ root: wrapper });
                }
            }, 250);

            // Cleanup class
            setTimeout(() => {
                wrapper.classList.remove('theme-animate');
            }, 500);
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
