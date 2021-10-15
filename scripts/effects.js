document.querySelectorAll('.hoverable-card').forEach(card => {
    const icon = card.querySelector('.mod_icon[data-hover-icon]');
    if (icon) {
        const src = icon.src;
        const hoverSrc = icon.dataset.hoverIcon;
        let refcount = 0;
        function update(inc) {
            refcount += inc;
            if (refcount) icon.src = hoverSrc;
            else icon.src = src;
            setImgDarkMode(icon);
        }
        card.addEventListener('focus', () => update(1));
        card.addEventListener('blur', () => update(-1));
        card.addEventListener('mouseenter', () => update(1));
        card.addEventListener('mouseleave', () => update(-1));
    }
});
