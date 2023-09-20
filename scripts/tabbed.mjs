function updateAriaSelected(tabbed) {
    tabbed.querySelectorAll('[role=tab]').forEach((tab) => tab.setAttribute('aria-selected', tab.checked));
}

function onTabSelected(e) {
    const tabbedKey = e.currentTarget.dataset.tabbedKey;
    const newValue = e.target.value;

    updateAriaSelected(e.currentTarget);

    for (const tabbed of document.querySelectorAll(`.tabbed[data-tabbed-key=${tabbedKey}]:not(#${e.currentTarget.id})`)) {
        updateTab(tabbed, newValue);
    }

    localStorage.setItem(`tabbed-${tabbedKey}`, newValue);
}

// Note: only called when local storage is updated on another page
function onStorageUpdated(e) {
    const newValue = e.newValue;

    if (e.key.startsWith('tabbed-')) {
        const tabbedKey = e.key.substring(7);
        for (const tabbed of document.querySelectorAll(`.tabbed[data-tabbed-key=${tabbedKey}]`)) {
            updateTab(tabbed, newValue);
        }
    }
}

function updateTab(tabbed, selectedValue) {
    const tabs = tabbed.querySelectorAll("input[type=radio]");
    let found = false;
    for (const tab of tabs) {
        const c = tab.value === selectedValue;
        tab.checked = c;
        tab.setAttribute('aria-selected', c);
        found |= c;
    }
    if (!found && tabs.length) {
        tabs[0].checked = true;
        tabs[0].setAttribute('aria-selected', true);
    }
}

export function init(tabbed) {
    const persistedTab = localStorage.getItem(`tabbed-${tabbed.dataset.tabbedKey}`);
    if (persistedTab) {
        updateTab(tabbed, persistedTab);
    } else {
        updateAriaSelected(tabbed);
    }

    tabbed.addEventListener('change', onTabSelected);
}

window.addEventListener('storage', onStorageUpdated);
