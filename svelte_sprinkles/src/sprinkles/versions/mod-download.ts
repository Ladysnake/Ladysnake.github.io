import {getVersions, type McVersion, type ModVersion} from "./modrinth-api.js";

/**
 *
 * @param {string} slug
 * @param {Map<string, {mcVersion: McVersion, modVersions: ModVersion[]}>} versions
 * @param down
 * @param {string} downloadIcon
 * @returns {Promise<void>}
 */
async function updateDropdown(slug: string, versions: Map<string, {mcVersion: McVersion, modVersions: ModVersion[]}>, down: HTMLElement, downloadIcon: string) {
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
            a.classList.add('mod-dropdown-link')
            span.innerHTML += version;
            span.innerHTML += downloadIcon;
            span.querySelector("svg")?.classList?.add("download-icon");

            a.appendChild(span);
            li.appendChild(a);
            down.appendChild(li);
        }
    }
}

/**
 * Gets the files for the mod
 *
 * @param slug Project slug for use in the Modrinth API
 * @param downloadIcon the HTML code for the download icon
 */
export async function mountModDownloads(slug: string, downloadIcon: string) {
    const down = document.getElementById("mod-download-dropdown")!;
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
