/*jshint esversion:6 */

// alright here we go


let json = {
    "1": "2",
    "3": "4"
};
let text = [];
let hissiemotes = [];
let setup = false;
//$.getJSON("http://ladysnake.github.io/hissiemotes.json", function(data) {json = data;});
let link = location.origin + "/hissiemotes.json";
$.get(link, function (data) {text = JSON.stringify(data).split(",");});
let def = setInterval(changeImage, 2500);
let hissiemote = document.getElementById("hissiemotes");
let imgSrc;

/**
 * Runs a function that constantly changes the shown Hissiemote
 */
function changeImage() {

    if (hissiemotes.length == 0) {
        for (let i = 0; i < text.length; i++) {
//            let line = "text";
            let line = text[i];
            if (line.includes('":"')) hissiemotes.push(line.split("\"")[3]);
        }
        setup = true;
    }

    let item = Math.floor(Math.random() * hissiemotes.length);
    let lnk = hissiemotes[item];

    hissiemote.src = lnk;
    setTimeout(function(){imgSrc = hissiemote.src;}, 100);
}