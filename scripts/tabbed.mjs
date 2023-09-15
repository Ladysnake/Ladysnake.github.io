function onTabSelected(e) {
    const tabbedKey = e.currentTarget.dataset.tabbedKey;
    const newValue = e.target.value;

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
        if (tab.value === selectedValue) {
            tab.checked = true;
            found = true;
        } else {
            tab.checked = false;
        }
    }
    if (!found && tabs.length) tabs[0].checked = true;
}

export function init(tabbed) {
    const persistedTab = localStorage.getItem(`tabbed-${tabbed.dataset.tabbedKey}`);
    if (persistedTab) {
        updateTab(tabbed, persistedTab);
    }

    tabbed.addEventListener('change', onTabSelected);
}

window.addEventListener('storage', onStorageUpdated);
