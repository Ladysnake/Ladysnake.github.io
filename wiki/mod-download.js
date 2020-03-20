/*jshint esversion: 6 */

/*
    This entire file is meant for JS-enabled modern browsers to access
    mod files from any platform. Because of the fact that all the mods
    that Ladysnake has are available on CurseForge and could update at
    any time, I'm using an API by NikkyAI, available in GitHub at link
    https://github.com/NikkyAI/CurseProxy/blob/master/README.md during
    this entire file. I thank that person for giving the API to anyone
    for use. Yes I did make this comment nice to look at for a reason.
*/

/*TODO
    Functions:
   [X]  get project ID from some list
   [ ]  find latest file for each Minecraft version
   [ ]  compile into a dropdown
   [ ]  place dropdown into page
*/

// Init
const curse = {
    "requiem": "265729",
    "illuminations": "292908",
    "creeperspores": "331636",
    "nomadbooks": "356921",
    "beem": "358105",
    "blast": "349938",
    "impersonate": "360333"
};
let dropdown = document.getElementById("mod-dropdown");

/**
 * Gets the ID(s) of a mod based on the list above
 * @param {String} modname Name of the mod according to the webpage
 */
function getID(modname) {
    let tmp = toString(curse[modname]);
    return tmp;
}
/**
 * Gets the latest file for the recommended version <p>
 * Uses latest version if no recommended one was given
 * @param {String} curseID Project ID, probably gotten from the above function
 */
function getFile(curseID) {
    let tmp = $.getJSON(`https://curse.nikky.moe/api/addon/${curseID}`);
    let data;
    setTimeout(function(){ data = tmp.responseJSON; }, 250);
    for (let i; i > data.length; i++) {
        
    }
}


console.log(getID("creeperspores"));