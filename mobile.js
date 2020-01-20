/*jshint esversion:6 */

/*

This is pretty much just a script that makes it all look a bit better on mobile.
It does this by changing the shown logo when the screen size is too small.

*/

let width = $(window).width();
// let height = $(window).height();
// let ratio = width / height;

let logo = document.getElementById("ladysnake_logo");

if (width < 430) {
    logo.src = "/img/ladysnake_icon_0.png";
}