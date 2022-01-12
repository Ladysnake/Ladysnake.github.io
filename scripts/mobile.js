/*jshint esversion:6 */

/*

This is pretty much just a script that makes it all look a bit better on mobile.
It does this by changing the shown logo when the screen size is too small.

oh also this happens on other small browsing windows as well

*/
let last;
let uhm;

/**
 * This was originally only run once at the time of webpage load.
 * It is now changed so it runs repeatedly every second to allow for changing screen sizes.
 *
 * Kill it by running (in the console) clearInterval(mobile)
 * @author sschr15
 */
let mobile = setInterval(function(){
    /** width of the screen, from JQuery */
    let width = window.screen.width;

    let logo = document.getElementById("ladysnake_logo");

    let bigness = (768 < width && width < 992);
    let bigness2 = (width < 430);

    uhm = bigness || bigness2;


    if (last != darkMode || uhm) {
        last = darkMode;

        /**
         * checks if the cookies contain darkmode=true.
         * If it does, then the dark mode image will be applied instead.
         */
        let numMode = darkMode ? 1 : 0;

        if (uhm) {
            logo.src = `/img/ladysnake_icon_${numMode}.png`;
        } else {
            logo.src = `/img/ladysnake_logo_${numMode}.png`;
        }
    }
}, 500);

function killMobileUpdater() {
    clearInterval(mobile);
}
