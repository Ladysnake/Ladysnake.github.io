/*jshint esversion: 6 */

// this code right here will run as soon as the site loads but then doesn't do anything past that
document.getElementById("preload-darkmodeicon").id = "darkmode-icon";
let icon = document.getElementById("darkmode-icon");
icon.src = "/img/darkmode0.svg";
let darkMode = false;
let a = 0;
let uhh;
let shift = false;
let ded;
if (document.cookie.includes("darkmode")) {
    refreshCookie();
}
if (document.cookie.includes("darkmode=true")) {
    setDarkMode(1);
}

/**
 * ok so apparently you can do this
 *
 * DARK MODE!
 * This function is called when you click the icon, which will make all elements go to dark mode...
 *
 * @author sschr15
 */
function setDarkMode(firstRun) {
    let cookies = document.cookie;
    let cookeConsent;
    let cookie = cookies.includes("darkmode=true");
    let prevDark = darkMode;
//    shift = isKeyPressed(16); // contains outdated code
    /* jshint -W033 */
//    if (shift) {document.cookie = "a=a"}
//    ded = shift ? function(){document.cookie="a=a"} : ded;
    /* jshint +W033 */
    if (firstRun === undefined) {
        if (cookies.length === 0) {
            cookeConsent = (uhh !== undefined) ? uhh : confirm(
                "Do you want to save this as a cookie?\n" +
                "This will save the state of your option for a year at a time.\n" +
                "If you press cancel, dark mode will not persist from this page.\n" +
//                "Hold shift to set the cookie if you decide you do want a cookie.\n" +
                "The cookie will update its expiration date every time you come to the page, though!"
            );
            uhh = cookeConsent;
            darkMode = !darkMode;
        } else {
            cookeConsent = true;
        }
        if (cookeConsent) {
            if (cookie) {
                darkMode = false;
                document.cookie = "darkmode=false; Expires=" + getExpiryDate() + "; path=/";
            } else {
                darkMode = true;
                document.cookie = "darkmode=true; Expires=" + getExpiryDate() + "; path=/";
            }
        }
    } else if (cookie) {
        darkMode = true;
    }
    if (darkMode !== prevDark) {
        a = (a + 1) % 2;
        document.body.classList.toggle("dark-mode");
        for (let img of document.querySelectorAll('img')) {
            let srcPrev = img.src.toString();
            if (srcPrev.endsWith("_0.svg") || srcPrev.endsWith("_1.svg")) {
                img.src = srcPrev.substring(0, srcPrev.length - 5) + a.toString() + ".svg";
            } else if (srcPrev.endsWith("_0.png") || srcPrev.endsWith("_1.png")) {
                img.src = srcPrev.substring(0, srcPrev.length - 5) + a.toString() + ".png";
            }
        }
	document.getElementById("syntax-stylesheet").setAttribute("href", darkMode ? "/css/syntax-monokai.css" : "/css/syntax-github.css");
        icon.src = `/img/darkmode${a.toString()}.svg`;
/*
        let ladysnake = document.getElementById("ladysnake_logo");
        ladysnake.src = `/img/ladysnake_logo_${a.toString()}.png`;
        if (document.getElementById("requiem") != null) {
            document.getElementById("requiem").src = `/img/requiem_icon_${a.toString()}.png`;
        }
*/
    }
}

/**
 * my own code to get the cookie date
 */
function getExpiryDate() {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    let dateUTC = date.toUTCString();
    dateUTC = dateUTC.substr(0, 26) + "UTC";
    return dateUTC;
}

/**
 * This refreshes the cookie expiry date...
 */
function refreshCookie() {
    let temp = document.cookie.includes("darkmode=true");
    document.cookie = "darkmode=0; path=/";
    document.cookie = `darkmode=${temp.toString()}; Expires=${getExpiryDate()}; path=/`;
}

/**
 * Tests if a key is pressed, using JQuery.
 *
 * See https://stackoverflow.com/a/3781360 for a list of character codes.
 * @param {Number} keycode
 */
function isKeyPressed(keycode) {
    let temp;
    temp = event.shiftKey;
    return temp;
}
