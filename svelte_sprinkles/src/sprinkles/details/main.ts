function openDetails() {
  const targetedId = decodeURIComponent(location.hash.substring(1));
  if (targetedId.length) {
    const anchor = document.getElementById(targetedId);
    if (anchor) {
      const details = anchor.closest('details') as HTMLDetailsElement | null;
      if (details) {
        details.open = true;
        anchor.scrollIntoView();
      }
    }
  }
}

openDetails();

window.addEventListener('hashchange', openDetails);
