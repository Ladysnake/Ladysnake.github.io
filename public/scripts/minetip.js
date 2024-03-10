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
            title.textContent = el.dataset.minetipTitle;
            const { width: tooltipWidth, height: tooltipHeight } = tooltip.getBoundingClientRect();
            tooltip.style.top = `${Math.min(event.clientY - 30, document.body.clientHeight - tooltipHeight - 10)}px`;
            tooltip.style.left = `${Math.min(event.clientX + 10, document.body.clientWidth - tooltipWidth - 10)}px`;
        });
        el.addEventListener('mouseleave', () => {
            document.body.removeChild(tooltip);
        });
    });
}
