/*jshint esversion: 6 */

function copyThis(num) {
    let hissiemotes = document.getElementsByClassName("itemThing");
//    let dem = [];
//    for (let i in hissiemotes) {
//        if (i.toString() !== i) dem.push(hissiemotes[i].children[0].children[1].innerHTML);
//    }

    out = ":" + hissiemotes[num].children[0].children[1].innerHTML + "!";

    let text = document.createElement("textarea");
    text.value = out;
    text.setAttribute("readonly", "");
    text.style.position = "absolute";
    text.style.left = "-32767px";
    document.body.appendChild(text);
    text.select();
    document.execCommand("copy");
    document.body.removeChild(text);
    alert("Copied " + out);
}