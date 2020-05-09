function print() {
    var header;
    if (location.href.split("/").length > 5) {
        header = null;
    } else {
        var printLogo = document.getElementById("printLogo");
        header = "<h1>" + printLogo.dataset.modname + "</h1>";
    }

    printJS({
        printable: 'printJS-Content',
        type: 'html', 
        header: header,
        css: [
            "/bootstrap.css",
            "/style.css"
        ]
    });
}