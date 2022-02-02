/*jshint esversion: 6 */

class DarkMode {
    constructor() {
        this.enabled = false;
        this.acceptLocalStorage = undefined;
        this.listeners = [];
    }

    addListener(listener) {
        if (typeof listener !== 'function') throw new Error(listener + " is not a function");
        this.listeners.push(listener);
    }

    setImgDarkMode(img) {
        const mode = (+this.enabled).toString();
        const srcPrev = img.src.toString();

        if (srcPrev.endsWith("_0.svg") || srcPrev.endsWith("_1.svg")) {
            img.src = srcPrev.substring(0, srcPrev.length - 5) + mode + ".svg";
        } else if (srcPrev.endsWith("_0.png") || srcPrev.endsWith("_1.png")) {
            img.src = srcPrev.substring(0, srcPrev.length - 5) + mode + ".png";
        }
    }

    toggleDarkMode() {
        if (this.acceptLocalStorage === undefined) {
            // Nothing stored => ask the user for storing stuff
            this.acceptLocalStorage = confirm(
                "Do you want to save this setting in your browser?\n" +
                "If you press cancel, dark mode will not persist from this page.\n"
            );
        }

        this.enabled = !this.enabled;

        if (this.acceptLocalStorage) {
            localStorage.setItem("dark-mode", this.enabled.toString());
        }

        this.applyDarkMode();

        for (const listener of this.listeners) {
            listener(this.enabled);
        }
    }

    setupDarkModeButton() {
        document.getElementById("preload-darkmodeicon").id = "darkmode-icon";
        const icon = document.getElementById("darkmode-icon");
        icon.src = `/img/darkmode_${+this.enabled}.svg`;
        this.applyDarkMode();
    }

    /**
     * ok so apparently you can do this
     *
     * DARK MODE!
     * This function is called when you click the icon, which will make all elements go to dark mode...
     *
     * @author sschr15
     */
    applyDarkMode() {
        if (this.enabled) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode")
        }

        for (let img of document.querySelectorAll('img')) {
            this.setImgDarkMode(img);
        }

        document.getElementById("syntax-stylesheet").setAttribute("href", this.enabled ? "/css/syntax-monokai.css" : "/css/syntax-github.css");
    }

    init() {
        const darkModeSetting = localStorage.getItem("dark-mode");

        if (darkModeSetting) {
            // If there is already stuff in the local storage, it means the user consented earlier
            this.acceptLocalStorage = true;

            if (darkModeSetting === "true") {
                this.enabled = true;
                this.applyDarkMode();
            }
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            this.enabled = true;
        }
    }
}

const darkMode = new DarkMode();

darkMode.init();
