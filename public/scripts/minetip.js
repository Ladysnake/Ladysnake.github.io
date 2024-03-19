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
    const { x: left, y: top } = el.getBoundingClientRect();
    const { width: tooltipWidth } = tooltip.getBoundingClientRect();
    // Position our tooltip within the element so that it scrolls and gets picked up by assistive technologies accordingly
    tooltip.style.position = 'absolute';
    // Ensure the tooltip fits horizontally within the page
    tooltip.style.left = `${Math.min(10, document.body.clientWidth - left - tooltipWidth - 10)}px`;
    // We can almost certainly scroll vertically to get our tooltip into view so don't bother with vertical fit
    tooltip.style.top = `-30px`;
}

export function initTooltips() {
    let focusedElement = null;

    document.querySelectorAll('[data-minetip-title]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
        });
        // Prevent focusing this specific element from mouse click
        el.addEventListener('mousedown', (e) => {
            e.stopImmediatePropagation();
            e.preventDefault();
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
