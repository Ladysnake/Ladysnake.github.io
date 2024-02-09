export function initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.id = 'minetip-tooltip';
    const title = document.createElement('span');
    title.classList.add('minetip-title');
    tooltip.appendChild(title);
    document.querySelectorAll('[data-minetip-title]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
        })
        el.addEventListener('mousemove', (event) => {
            tooltip.style.top = `${event.clientY - 30}px`;
            tooltip.style.left = `${event.clientX + 10}px`;
            title.textContent = el.dataset.minetipTitle;
        });
        el.addEventListener('mouseleave', (event) => {
            document.body.removeChild(tooltip);
        });
    })
}
