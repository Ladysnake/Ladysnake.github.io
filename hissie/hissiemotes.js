/*jshint esversion:6 */

// alright here we go

let tmp = jQuery.getJSON("http://ladysnake.github.io/hissiemotes.json");
let def = setInterval(changeImage, 2500);
let hissiemote = document.getElementById("hissiemotes");
let json;

setTimeout(setJSON, 1000);

function setJSON() {
    json = tmp.responseJSON;
}

function changeImage() {
    //TODO make this do a thing
    var randomProperty = function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    };

    hissiemote.src = randomProperty(json);
    console.log(json);
}