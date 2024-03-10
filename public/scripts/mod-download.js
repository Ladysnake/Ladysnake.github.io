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

import {getVersions} from "./modrinth-api.js";


/**
 *
 * @param {string} slug
 * @param {Map<string, {mcVersion: McVersion, modVersions: ModVersion[]}>} versions
 * @param down
 * @param {string} downloadIcon
 * @returns {Promise<void>}
 */
async function updateDropdown(slug, versions, down, downloadIcon) {
    if (versions !== undefined) {
        const li = document.createElement("li");
        const warning = document.createElement("em");
        warning.innerHTML = "WARNING: Not all versions may be supported.";
        warning.classList.add('download-notice');
        li.appendChild(warning);
        down.appendChild(li);
        for (const [version, versionData] of versions) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            let span = document.createElement("span");

            a.href = `https://modrinth.com/mod/${slug}/version/${versionData.modVersions[0].name}`;
            span.innerHTML += version;
            span.innerHTML += downloadIcon;
            span.querySelector("svg").classList.add("download-icon");

            a.appendChild(span);
            li.appendChild(a);
            down.appendChild(li);
        }
    }
}

/**
 * Gets the files for the mod
 *
 * @param {String} slug Project slug for use in the Modrinth API
 * @param {String} downloadIcon the HTML code for the download icon
 */
export async function mountModDownloads(slug, downloadIcon) {
    const down = document.getElementById("mod-download-dropdown");
    try {
        const data = await getVersions(slug);
        if (data.size === 0) down.append('Failed to fetch latest downloads');
        else {
            await updateDropdown(slug, data, down, downloadIcon);
        }
    } catch (e) {
        console.error(e);
        down.append('Failed to fetch latest downloads')
    }

}
