/*jshint esversion: 6 */

/**
 * ok so apparently you can do this
 * 
 * DARK MODE!
 * This function is called when you click the icon, which will make all elements go to dark mode...
 * 
 * @author sschr15
 * @returns True if it doesn't error
 */
function setDarkMode() {
    let allElements = document.getElementsByTagName("*");
    let cookeConsent;
    if (cookies.length === 0) {
        cookeConsent = confirm("uh\nDo you want to save this as a cookie?\nThis will save the state of your option for a year at a time.\nIf you press cancel, then your dark mode will reset once you leave.");
    } else {
        cookeConsent = true;
    }
    if (cookeConsent) {
        if (cookies.includes("darkmode=false")) {
            darkMode = true;
            document.cookie = "darkmode=true expires=" + getExpiryDate();
        } else {
            darkMode = false;
            document.cookie = "darkmode=false expires=" + getExpiryDate();
        }
    }
    if (darkMode) {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.toggle("darkmode");
        }
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

let darkMode = false;
let cookies = document.cookie;
if (cookies.includes("darkmode=true")) {
    setDarkMode();
}