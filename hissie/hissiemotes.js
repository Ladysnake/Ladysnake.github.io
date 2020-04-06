/*jshint esversion:6 */

// alright here we go


let json = {
    "1": "2",
    "3": "4"
};
$.getJSON("http://ladysnake.github.io/hissiemotes.json", function(data) {json = data;});
//let def = setInterval(changeImage, 2500);
let hissiemote = document.getElementById("hissiemotes");


function changeImage() {
    /**@param {Object} obj */
    var randomProperty = function (obj) {
        const keys = Object.keys(obj);
        const randIntex = Math.floor(Math.random() * keys.length);
        const randKey = keys[randIntex];
        const name = obj[randKey];
        return name;
    };

    hissiemote.src = randomProperty(json);
}