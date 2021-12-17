/*jshint esversion: 6 */

let darkMode = false;
let acceptDarkModeStorage = undefined;

initDarkMode();

function setImgDarkMode(img) {
    const mode = (+darkMode).toString();
    const srcPrev = img.src.toString();

    if (srcPrev.endsWith("_0.svg") || srcPrev.endsWith("_1.svg")) {
        img.src = srcPrev.substring(0, srcPrev.length - 5) + mode + ".svg";
    } else if (srcPrev.endsWith("_0.png") || srcPrev.endsWith("_1.png")) {
        img.src = srcPrev.substring(0, srcPrev.length - 5) + mode + ".png";
    }
}

function toggleDarkMode() {
    if (acceptDarkModeStorage === undefined) {
        // Nothing stored => ask the user for storing stuff
        acceptDarkModeStorage = confirm(
            "Do you want to save this setting in your browser?\n" +
            "If you press cancel, dark mode will not persist from this page.\n"
        );
    }

    darkMode = !darkMode;

    if (acceptDarkModeStorage) {
        localStorage.setItem("dark-mode", darkMode.toString());
    }

    applyDarkMode();
}

function initDarkMode() {
    const darkModeSetting = localStorage.getItem("dark-mode");

    if (darkModeSetting) {
        // If there is already stuff in the local storage, it means the user consented earlier
        acceptDarkModeStorage = true;

        if (darkModeSetting === "true") {
            darkMode = true;
            applyDarkMode();
        }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        darkMode = true;
    }
}

function setupDarkModeButton() {
    document.getElementById("preload-darkmodeicon").id = "darkmode-icon";
    const icon = document.getElementById("darkmode-icon");
    icon.src = `/img/darkmode_${+darkMode}.svg`;
    applyDarkMode();
}

/**
 * ok so apparently you can do this
 *
 * DARK MODE!
 * This function is called when you click the icon, which will make all elements go to dark mode...
 *
 * @author sschr15
 */
function applyDarkMode() {
    if (darkMode) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode")
    }

    for (let img of document.querySelectorAll('img')) {
        setImgDarkMode(img);
    }

    document.getElementById("syntax-stylesheet").setAttribute("href", darkMode ? "/css/syntax-monokai.css" : "/css/syntax-github.css");
}
