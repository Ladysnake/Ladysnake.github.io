function createTooltip() {
    const tooltip = document.createElement('div');
    const title = document.createElement('span');
    const description = document.createElement('span');
    tooltip.id = 'minetip-tooltip';
    title.classList.add('minetip-title');
    description.classList.add('minetip-description');
    tooltip.appendChild(title);
    tooltip.appendChild(description);
    return { tooltip, title, description };
}

const { tooltip, title, description } = createTooltip();

function setTooltipContent(el) {
    title.textContent = el.dataset.minetipTitle;
    if (el.dataset.minetipDescription) {
        description.style.display = '';
        description.textContent = el.dataset.minetipDescription;
    } else {
        description.style.display = 'none';
    }
}

function placeTooltipForFocus(el) {
    setTooltipContent(el);
    const { x: left, y: top } = el.getBoundingClientRect();
    const { width: tooltipWidth } = tooltip.getBoundingClientRect();
    // Position our tooltip within the element so that it scrolls and gets picked up by assistive technologies accordingly
    tooltip.style.position = 'absolute';
    // Ensure the tooltip fits horizontally within the page
    tooltip.style.left = `${Math.min(10, document.body.clientWidth - left - tooltipWidth - 10)}px`;
    // We can almost certainly scroll vertically to get our tooltip into view so don't bother with vertical fit
    tooltip.style.top = `-30px`;
}

function placeTooltipForCursor(el, mouseX, mouseY) {
    setTooltipContent(el);
    const { width: tooltipWidth, height: tooltipHeight } = tooltip.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${Math.min(mouseX + 10, document.body.clientWidth - tooltipWidth - 10)}px`;
    tooltip.style.top = `${Math.min(mouseY - 30, document.body.clientHeight - tooltipHeight - 10)}px`;
}

export function initTooltips() {
    let focusedElement = null;

    function onMouseEnter(e) {
        placeTooltipForCursor(e.currentTarget, e.clientX, e.clientY);
        document.body.appendChild(tooltip);
    }

    function onFocusIn(e) {
        focusedElement = e.currentTarget;
        placeTooltipForFocus(e.currentTarget);
        e.currentTarget.appendChild(tooltip);
    }

    function onMouseMove(e) {
        return placeTooltipForCursor(e.currentTarget, e.clientX, e.clientY);
    }

    function onMouseLeave() {
        if (focusedElement == null) {
            document.body.removeChild(tooltip);
        } else {
            focusedElement.appendChild(tooltip);
            placeTooltipForFocus(focusedElement);
        }
    }

    function onFocusOut(e) {
        focusedElement = null;
        e.currentTarget.removeChild(tooltip);
    }

    document.querySelectorAll('[data-minetip-title]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('focusin', onFocusIn);
        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);
        el.addEventListener('focusout', onFocusOut);

        // tabindex set => artificially keyboard-focusable => prevent focusing this element from mouse click
        if (el.tabIndex === 0) {
            el.addEventListener('mousedown', (e) => e.preventDefault());
        }
    });
}
