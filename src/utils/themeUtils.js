export const applyTheme = (theme = 'light') => {
  let isDark = false;
  if (theme === 'dark') {
    isDark = true;
  } else if (theme === 'system') {
    isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = false;
  }

  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};
