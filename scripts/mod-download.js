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

/**
 * Gets the files for the mod <p>
 * Requires the CurseForge description to contain the version list prefixed with
 * <code>Versions:</code>
 * @param {String} curseID Project ID, probably gotten from the above function
 */
async function mountModDownloads(curseID) {
    const down = document.getElementById("mod-dropdown");
    const dataPromise = fetch(`https://curse.nikky.moe/api/addon/${curseID}`).then(it => it.ok && it.json());
    const descPromise = fetch(`https://curse.nikky.moe/api/addon/${curseID}/description`).then(it => it.ok && it.text());
    let data;
    let desc;
    try {
        data = await dataPromise;
        desc = await descPromise;
        if (!data) down.append('Failed to fetch latest downloads');
    } catch (e) {
        down.append('Failed to fetch latest downloads')
    }
    let flag = false;

    let attempt = setInterval(function() {
        if (desc !== undefined && data !== undefined && !flag) {
            let versions;
            let flag2;
            if(/versions:/i.test(desc)) {
                desc = desc.slice(desc.indexOf("ersions:"), desc.indexOf("ersions:") + 250);
                desc = desc.replace(/ /g, '-');
                const reg = /[0-9]\.[0-9]+(\.[0-9]*)*(-Snapshot)?/gi;
                versions = desc.match(reg);
                flag2 = true;
            } else {
                versions = [...new Set(data.gameVersionLatestFiles.map(f => f.gameVersion))];
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.innerHTML = "WARNING: Not all versions<br />may be supported.";
                li.appendChild(a);
                down.appendChild(li);
            }
            versions.sort().reverse();
            for (const version of versions) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                let span = document.createElement("span");
//                let p = document.createElement("p");
                let img = document.createElement("img");

                a.href = `https://curse.nikky.moe/api/url/${curseID}?version=${version}`;
                span.innerHTML += version;
                img.src = `/img/download_${darkMode ? 1 : 0}.svg`;
                if (darkMode) { img.classList.add("darkmode"); }
                img.classList.add("download-icon");

//                span.appendChild(p);
                span.appendChild(img);
//                span.innerHTML += versions[v];
                a.appendChild(span);
                li.appendChild(a);
                down.appendChild(li);
            }
            if (flag2) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = data.websiteUrl;
                a.innerHTML = "More Versions...";
                li.appendChild(a);
                down.appendChild(li);
            }
            clearInterval(attempt);
            flag = true;
        } else if (flag) { clearInterval(attempt); }
    }, 50);
}
