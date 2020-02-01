/*jshint esversion:6 */

/*

This is pretty much just a script that makes it all look a bit better on mobile.
It does this by changing the shown logo when the screen size is too small.

oh also this happens on other small browsing windows as well

*/

/**width of the screen, from JQuery */
let width = $(window).width();

let logo = document.getElementById("ladysnake_logo");

let bigness = (768 < width && width < 992);
let bigness2 = (width < 430);

if (bigness || bigness2) {
    logo.src = "/img/ladysnake_icon_0.png";
}