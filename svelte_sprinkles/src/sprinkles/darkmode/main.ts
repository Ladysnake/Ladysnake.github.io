const darkmodeToggle = document.getElementById('darkmode-toggle');
if (darkmodeToggle) {
  darkmodeToggle.addEventListener('click', async () => {
    // Better avoid loading all of Svelte just for a button, at least wait until someone clicks it
    const { darkModeEnabled } = await import('../../lib/darkMode');
    darkModeEnabled.update((v) => !v)
  });
  darkmodeToggle.classList.remove('hidden');
}
