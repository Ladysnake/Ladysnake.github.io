/*jshint esversion: 6 */

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
    let allElements = document.getElementsByTagName("*");
    let cookeConsent;
    let cookie = cookies.includes("darkmode=true");
    let prevDark = darkMode;
    if (firstRun == undefined) {
        if (cookies.length === 0) {
            cookeConsent = confirm("Do you want to save this as a cookie?\nThis will save the state of your option for a year at a time.\nIf you press cancel, dark mode will not enable.");
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
    } else {
        if (cookie) {
            darkMode = true;
            document.cookie = "darkmode=true; Expires=" + getExpiryDate() + "; path=/";
        } else if (cookies.length != 0) {
            document.cookie = "darkmode=false; Expires=" + getExpiryDate() + "; path=/";
        }
    }
    if (darkMode != prevDark) {
        a = (a + 1) % 2;
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.toggle("dark-mode");
            let currentElement = allElements[i];
            if (currentElement.src.includes("requiem")) {
                currentElement.src = `/img/requiem_icon_${a.toString()}.png`;
            } else if (currentElement.src.includes("curseforge")) {
                currentElement.src = `/img/curseforge_${a.toString()}.svg`;
            }
        }
        icon.src = `/img/darkmode${a.toString()}.svg`;
        let ladysnake = document.getElementById("ladysnake_logo");
        ladysnake.src = `/img/ladysnake_logo_${a.toString()}.png`;
        if (document.getElementById("requiem") != null) {
            document.getElementById("requiem").src = `/img/requiem_icon_${a.toString()}.png`;
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

// this code right here will run as soon as the site loads but then doesn't do anything past that
document.getElementById("preload-darkmodeicon").id = "darkmode-icon";
let icon = document.getElementById("darkmode-icon");
icon.src = "/img/darkmode0.svg";
let darkMode = false;
let a = 0;
if (document.cookie.includes("darkmode=true")) {
    setDarkMode(1);
}
