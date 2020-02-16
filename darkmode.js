/*jshint esversion: 6 */

// this code right here will run as soon as the site loads but then doesn't do anything past that
document.getElementById("preload-darkmodeicon").id = "darkmode-icon";
let icon = document.getElementById("darkmode-icon");
icon.src = "/img/darkmode0.svg";
let darkMode = false;
let a = 0;
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
    let allElements = document.getElementsByTagName("*");
    let cookeConsent;
    let cookie = cookies.includes("darkmode=true");
    let prevDark = darkMode;
    if (firstRun == undefined) {
        if (cookies.length === 0) {
            cookeConsent = confirm(
                "Do you want to save this as a cookie?\n" +
                "This will save the state of your option for a year at a time.\n" +
                "If you press cancel, dark mode will not enable.\n" +
                "The cookie will update its expiration date every time you come to the page, though!");
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
    if (darkMode != prevDark) {
        a = (a + 1) % 2;
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.toggle("dark-mode");
            let currentElement = allElements[i];
            if (currentElement.hasAttribute("src")) {
                let srcPrev = currentElement.src.toString();
                if (srcPrev.endsWith("_0.svg") || srcPrev.endsWith("_1.svg")) {
                    currentElement.src = srcPrev.substring(0, srcPrev.length - 5) + a.toString() + ".svg";
                } else if (srcPrev.endsWith("_0.png") || srcPrev.endsWith("_1.png")) {
                    currentElement.src = srcPrev.substring(0, srcPrev.length - 5) + a.toString() + ".png";
                }
            }
        }
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
    let temp;
    if (document.cookie.includes("darkmode=true")) {
        temp = true;
    } else {
        temp = false;
    }
    document.cookie = "darkmode=0; path=/";
    document.cookie = `darkmode=${temp.toString()}; Expires=${getExpiryDate()}; path=/`;
}