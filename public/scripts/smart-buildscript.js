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
 * @param {string|undefined} primaryMod
 * @return {Map<string, McIndexedVersion>}
 */
function indexVersions(projectVersions, primaryMod) {
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
    return new Map([...result].filter(([_, v]) => primaryMod == null || v.modVersions.has(primaryMod)).sort(compareMcVersions));
}

function doReplaceVersion(modName, version = 'VERSION') {
    for (const e of document.getElementsByClassName(`mod-version-${modName}`)) {
        e.innerText = version;
    }
}

function doReplaceMavenGroup(modName, mavenGroup = 'MAVEN_GROUP') {
    for (const e of document.getElementsByClassName(`maven-group-${modName}`)) {
        e.innerText = mavenGroup;
    }
}

function doReplaceCcaModule(module) {
    for (const e of document.getElementsByClassName(`cca-module-template`)) {
        e.innerText = module;
    }
}

/**
 * @param {string} modName
 * @param {string|undefined} modVersion
 * @returns {string}
 */
function getMavenGroup(modName, modVersion) {
    if (modName === 'cca') {
        if (modVersion == null) return 'io.github.onyxstudios';
        const major = modVersion.split('.')[0];
        if (major < 4) {
            return '`see table below`';
        } else if (major < 6) {
            return 'dev.onyxstudios';
        } else {
            return 'org.ladysnake';
        }
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
        const modVersion = version.modVersions.get(modName)?.filter((v) => v.loaders.includes('fabric') || v.loaders.includes('quilt'))?.[0]?.version;
        doReplaceVersion(modName, modVersion ?? `<${modName.toLocaleUpperCase()}_VERSION>`);
        doReplaceMavenGroup(modName, getMavenGroup(modName, modVersion));
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
 * @param {boolean|undefined} showAllVersions if false, only the MC version relevant to the first mod in modrinthProjectIds will be displayed
 * @returns {Promise<void>}
 */
export async function setUpSmartBuildscript(modrinthProjectIds, showAllVersions) {
    for (let controls of document.getElementsByClassName('smart-buildscript-controls')) {
        controls.hidden = null;
        for (let radio of controls.querySelectorAll('input[name=cca-module-picker]')) {
            radio.addEventListener('change', e => radio.checked && doReplaceCcaModule(radio.value))
        }
    }
    const mods = Object.keys(modrinthProjectIds);
    const projectVersions = indexVersions(await Promise.all(
        Object.entries(modrinthProjectIds).map(
            ([mod, modrinthProjectId]) =>
                getVersions(modrinthProjectId).then((v) => [mod, v])
        )
    ), showAllVersions ? undefined : mods[0]);

    for (const versionSelect of document.getElementsByClassName('mc-version-select')) {
        versionSelect.addEventListener('change', () => {
            if (projectVersions.has(versionSelect.value)) {
                selectVersion(projectVersions.get(versionSelect.value), mods, true);
            }
        });
    }

    updateVersionSelects(projectVersions, mods);
}
