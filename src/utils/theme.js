const theme = {
    key: 'zynk-theme',

    init() {
        const savedTheme = localStorage.getItem(this.key);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    toggle() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem(this.key, isDark ? 'dark' : 'light');
        return isDark;
    }
};

// Auto-init on load
theme.init();
