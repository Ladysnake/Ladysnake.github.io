import { getVersions } from "./modrinth-api.js";

/**
 * @typedef {Object} McIndexedVersion
 * @property {McVersion} mcVersion
 * @property {Map<ModRef, ModVersion[]>} modVersions
 */

/**
 * @param versions {Map<string, McIndexedVersion>}
 * @returns {McIndexedVersion}|undefined}
 */
function pickDefaultVersion(versions) {
    const pinned = new URL(window.location.href).searchParams.get('version');
    if (pinned && versions.has(pinned)) {
        return versions.get(pinned);
    }

    return versions[0];
}

/**
 *
 * @param {[ModRef, Map<string, {mcVersion: McVersion, modVersions: ModVersion[]}>][]} projectVersions an array of pairs of mod name to available versions
 * @return {Map<string, McIndexedVersion>}
 */
function indexVersions(projectVersions) {
    /** @type {Map<string, McIndexedVersion>} */
    const result = new Map();
    for (const [mod, versions] of projectVersions) {
        for (const [mcVersionId, {mcVersion, modVersions}] of versions) {
            if (!result.has(mcVersionId)) result.set(mcVersionId, {
                mcVersion,
                modVersions: new Map(),
            });
            result.get(mcVersionId).modVersions.set(mod, modVersions);
        }
    }
    if (projectVersions.length > 1) {
        // iterate again to prune every version that is lacking one of the mods
        for (const [mcVersion, mods] of result) {
            if (mods.size < projectVersions.length) { // missing one or more mods
                result.delete(mcVersion);
            }
        }
    }
    return result;
}

function doReplace(modName, version = 'VERSION') {
    for (const e of document.getElementsByClassName(`mod-version-${modName}`)) {
        e.innerText = version;
    }
}

/**
 * @param {McIndexedVersion} version
 * @param {boolean?} pin
 */
function selectVersion(version, pin) {
    // update the window URL to include the selected version
    const state = history.state;
    const title = document.title;
    if (pin) {
        const url = new URL(window.location.href);
        url.searchParams.set('version', version.mcVersion.id);
        history.replaceState(state, title, url);
    }

    // replace the version in the buildscript
    for (const [modName, modVersions] of version.modVersions) {
        doReplace(modName, modVersions[0]?.name);
    }
}

/**
 * @param {Map<string, McIndexedVersion>} projectVersions
 */
function updateVersionSelects(projectVersions) {
    const showPreReleases = document.getElementById('include-prereleases')?.checked || false;
    /** @type {Map<string, McIndexedVersion>} */
    const validVersions = new Map([...projectVersions].filter(([_, { mcVersion }]) => showPreReleases || !mcVersion.isSnapshot));

    const selectedVersion = pickDefaultVersion(validVersions);
    if (selectedVersion) {
        selectVersion(selectedVersion);
    }
    for (const versionSelect of document.getElementsByClassName('mc-version-select')) {
        versionSelect.value = selectedVersion?.id;
        versionSelect.disabled = !selectedVersion;
        versionSelect.replaceChildren(...[...validVersions.keys()].map(versionId => {
            const option = document.createElement('option');
            option.value = versionId;
            option.innerText = `Minecraft ${versionId}`;
            option.selected = versionId === selectedVersion?.mcVersion?.id;
            return option;
        }));
    }
}

/**
 * @param {Record<string, string>} modrinthProjectIds
 * @returns {Promise<void>}
 */
export async function setUpSmartBuildscript(modrinthProjectIds) {
    const projectVersions = indexVersions(await Promise.all(
        Object.entries(modrinthProjectIds).map(
            ([mod, modrinthProjectId]) =>
                getVersions(modrinthProjectId).then((v) => [mod, v])
        )
    ));

    for (const versionSelect of document.getElementsByClassName('mc-version-select')) {
        versionSelect.addEventListener('change', () => {
            if (projectVersions.has(versionSelect.value)) {
                selectVersion(projectVersions.get(versionSelect.value), true);
            }
        });
    }

    updateVersionSelects(projectVersions);
}
