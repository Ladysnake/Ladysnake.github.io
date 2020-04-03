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
   [?]  find latest file for each Minecraft version
   [X]  compile into a dropdown
   [?]  place dropdown into page
*/

// Init
const curse = {
    "requiem": "265729",
    "illuminations": "292908",
    "illuminationsForge": "351392",
    "creeperspores": "331636",
    "nomadbooks": "356921",
    "beem": "358105",
    "blast": "349938",
    "impersonate": "360333"
};
let data;
let desc;
let down = document.getElementById("mod-dropdown");

/**
 * Gets the ID(s) of a mod based on the list above
 * @param {String} modname Name of the mod according to the webpage
 */
function getID(modname) { return curse[modname]; }
/**
 * Gets the files for the mod <p>
 * Requires the CurseForge description to contain the version list prefixed with
 * <code>Versions:</code>
 * @param {String} curseID Project ID, probably gotten from the above function
 */
function getFile(curseID) {
    $.getJSON(`https://curse.nikky.moe/api/addon/${curseID}`, function(a) {data = a;});
    $.get(`https://curse.nikky.moe/api/addon/${curseID}/description`, function(a) {desc = a;});
    setTimeout(function(){
        if(/versions:/i.test(desc)) {
            desc = desc.slice(desc.indexOf("ersions:"), desc.indexOf("ersions:") + 250);    
            let reg = /[0-9]\.[0-9]+(\.[0-9]*)*/g;
            let versions = desc.match(reg);
            for (let v in versions) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = `https://curse.nikky.moe/api/url/${curseID}?version=${versions[v]}`;
                a.innerHTML = versions[v];
                li.appendChild(a);
                down.appendChild(li);
            }
        }
    }, 500);
}

let i = 0;

function doTheThing() { if (i++ == 0) getFile(getID(mod.split(".")[0])); }

mod = window.location.href.split("/wiki/")[1];
getFile(getID(mod.split(".")[0]));
