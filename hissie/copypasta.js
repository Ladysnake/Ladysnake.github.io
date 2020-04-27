/*jshint esversion: 6 */

function copyThis(num) {
    let hissiemotes = document.getElementsByClassName("itemThing");
//    let dem = [];
//    for (let i in hissiemotes) {
//        if (i.toString() !== i) dem.push(hissiemotes[i].children[0].children[1].innerHTML);
//    }

    out = ":" + hissiemotes[num].children[0].children[1].innerHTML + "!";

    doTheCopy(out);
}

function doTheCopy(cpTxt) {
    let text = document.createElement("textarea");
    text.value = cpTxt;
    text.setAttribute("readonly", "");
    text.style.position = "absolute";
    text.style.left = "-32767px";
    document.body.appendChild(text);
    text.select();
    document.execCommand("copy");
    document.body.removeChild(text);
    alert("Copied " + cpTxt);
}

function indexCopy() {
    if (!setup) {
        console.warn("Unable to copy the image because I don't have images yet. Trying again in 0.5s");
        setTimeout(indexCopy(), 500);
        return;
    }

    let img = document.getElementById("hissiemotes").src;

    for (let i = 0; i < text.length; i++) {
        if (text[i].includes(img)) doTheCopy(":" + text[i].split('"')[1] + "!");
    }
}