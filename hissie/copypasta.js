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
        console.warn("Unable to copy the image because I don't have images yet. Try again shortly...");
        return;
    }

    for (let i = 0; i < text.length; i++) {
        if (text[i].includes(imgSrc)) doTheCopy(":" + text[i].split('"')[1] + "!");
    }
}