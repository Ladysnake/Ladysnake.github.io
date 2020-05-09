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
            "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css",
            "https://fonts.googleapis.com/css?family=Poppins:400,300,500,600,700",
            "/style.css"
        ]
    });
}