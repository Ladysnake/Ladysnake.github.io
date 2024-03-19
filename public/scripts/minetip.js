function createTooltip() {
    const tooltip = document.createElement('div');
    const title = document.createElement('span');
    tooltip.id = 'minetip-tooltip';
    title.classList.add('minetip-title');
    tooltip.appendChild(title);
    return {tooltip, title};
}

const {tooltip, title} = createTooltip();

const placeTooltipForFocus = (el) => {
    title.textContent = el.dataset.minetipTitle;
    tooltip.style.top = '-30px';
    tooltip.style.left = '10px';
    tooltip.style.position = 'absolute';
}

export function initTooltips() {
    let focusedElement = null;

    document.querySelectorAll('[data-minetip-title]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
        });
        el.addEventListener('focusin', () => {
            focusedElement = el;
            el.appendChild(tooltip);
            placeTooltipForFocus(el);
        });
        el.addEventListener('mousemove', (event) => {
            title.textContent = el.dataset.minetipTitle;
            const { width: tooltipWidth, height: tooltipHeight } = tooltip.getBoundingClientRect();
            tooltip.style.top = `${Math.min(event.clientY - 30, document.body.clientHeight - tooltipHeight - 10)}px`;
            tooltip.style.left = `${Math.min(event.clientX + 10, document.body.clientWidth - tooltipWidth - 10)}px`;
            tooltip.style.position = 'fixed';
        });
        el.addEventListener('mouseleave', () => {
            if (focusedElement == null) {
                document.body.removeChild(tooltip);
            } else {
                focusedElement.appendChild(tooltip);
                placeTooltipForFocus(focusedElement);
            }
        });
        el.addEventListener('focusout', () => {
            focusedElement = null;
            el.removeChild(tooltip);
        });
    });
}
