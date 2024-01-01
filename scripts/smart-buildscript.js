import {compareMcVersions, getVersions} from "./modrinth-api.js";

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

    return versions.values().next().value;
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
    return new Map([...result].sort(compareMcVersions));
}

function doReplace(modName, version = 'VERSION') {
    for (const e of document.getElementsByClassName(`mod-version-${modName}`)) {
        e.innerText = version;
    }
}

/**
 * @param {McIndexedVersion} version
 * @param {string[]} mods
 * @param {boolean?} pin
 */
function selectVersion(version, mods, pin) {
    // update the window URL to include the selected version
    if (pin) {
        const url = new URL(window.location.href);
        url.searchParams.set('version', version.mcVersion.id);
        history.replaceState(history.state, document.title, url);
    }

    // replace the version in the buildscript
    for (const modName of mods) {
        doReplace(modName, version.modVersions.get(modName)?.filter((v) => v.loaders.includes('fabric') || v.loaders.includes('quilt'))?.[0]?.name ?? `<${modName.toLocaleUpperCase()}_VERSION>`);
    }
}

/**
 * @param {Map<string, McIndexedVersion>} projectVersions
 * @param {string[]} mods
 */
function updateVersionSelects(projectVersions, mods) {
    const showPreReleases = document.getElementById('include-prereleases')?.checked || false;
    /** @type {Map<string, McIndexedVersion>} */
    const validVersions = new Map([...projectVersions].filter(([_, { mcVersion }]) => showPreReleases || !mcVersion.isSnapshot));

    const selectedVersion = pickDefaultVersion(validVersions);
    if (selectedVersion) {
        selectVersion(selectedVersion, mods);
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
    const mods = Object.keys(modrinthProjectIds);
    const projectVersions = indexVersions(await Promise.all(
        Object.entries(modrinthProjectIds).map(
            ([mod, modrinthProjectId]) =>
                getVersions(modrinthProjectId).then((v) => [mod, v])
        )
    ));

    for (const versionSelect of document.getElementsByClassName('mc-version-select')) {
        versionSelect.addEventListener('change', () => {
            if (projectVersions.has(versionSelect.value)) {
                selectVersion(projectVersions.get(versionSelect.value), mods, true);
            }
        });
    }

    updateVersionSelects(projectVersions, mods);
}
