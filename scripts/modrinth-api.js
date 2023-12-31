function handleRequestTask(req) {
    return new Promise((resolve, reject) => {
        req.then(response => {
            if (response.ok) {
                resolve(response.json());
            } else {
                reject(response);
            }
        });
    });
}

/**
 * @typedef {Object} ModrinthVersion
 * @property {string} name
 * @property {string} version_number
 * @property {?string} changelog
 * @property {Object[]} dependencies
 * @property {string[]} game_versions
 * @property {string} version_type
 * @property {string[]} loaders
 * @property {boolean} featured
 * @property {string} id
 */
/**
 * @typedef {Object} ModVersion
 * @property {string} name
 * @property {string} version
 * @property {string} modrinthId
 */

/**
 * @typedef {Object} McVersion
 * @property {string} id
 * @property {Date} releaseTime
 * @property {boolean} isSnapshot
 * @property {ModVersion[]} versions
 */
/**
 * @param {string} modrinthProjectId
 * @returns {Promise<McVersion[]>}
 */
async function getVersions(modrinthProjectId) {

    // start both requests in parallel for extra speed
    const pistonMetaTask = fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json');
    const modrinthTask = fetch(`https://api.modrinth.com/v2/project/${modrinthProjectId}/version`);

    const modrinth = await handleRequestTask(modrinthTask);
    // sort versions by release date. this is probably™ fine as we split by MC version later
    modrinth.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));

    const pistonMeta = await handleRequestTask(pistonMetaTask).then(obj => {
        const map = new Map();
        obj.versions.forEach(version => {
            map.set(version.id, version);
        });
        return map;
    });

    const versions = new Map();
    modrinth.forEach(modrinthVersion => {
        modrinthVersion.game_versions.forEach(gameVersion => {
            if (!versions.has(gameVersion))
                versions.set(gameVersion, {
                    versions: [],
                });

            const data = versions.get(gameVersion);

            data.versions.push({ version: modrinthVersion.version_number, name: modrinthVersion.name, modrinthId: modrinthVersion.id });
        });
    });

    const versionsArray = Array.from(versions, ([id, data]) => ({
        id,
        releaseTime: new Date(pistonMeta.get(id)?.releaseTime || 0),
        isSnapshot: pistonMeta.get(id)?.type !== 'release',
        versions: data.versions,
    }));

    versionsArray.sort((a, b) => b.releaseTime - a.releaseTime);
    return versionsArray;
}

/**
 *
 * @param versions
 * @returns {McVersion|undefined}
 */
function pickDefaultVersion(versions) {
    const pinned = new URL(window.location.href).searchParams.get('version');
    if (pinned) {
        const pinnedVersion = versions.find((v) => v.id === pinned);
        if (pinnedVersion) return pinnedVersion;
    }

    return versions[0];
}

/**
 *
 * @param {string} modrinthProjectId
 * @returns {Promise<void>}
 */
export async function setUpSmartBuildscript(modrinthProjectId) {
    function doReplace(version = 'VERSION') {
        document.querySelectorAll('.mod-version').forEach(e => {
            e.innerText = version;
        });
    }
    getVersions(modrinthProjectId).then(versions => {
        const versionSelects = document.getElementsByClassName('mc-version-select');
        function selectVersion(version, pin) {
            // update the window URL to include the selected version
            const state = history.state;
            const title = document.title;
            if (pin) {
                const url = new URL(window.location.href);
                url.searchParams.set('version', version.id);
                history.replaceState(state, title, url);
            }

            // replace the version in the buildscript
            doReplace(version?.versions[0]?.name);
        }
        for (const versionSelect of versionSelects) {
            versionSelect.addEventListener('change', () => {
                const version = versions.find(v => v.id === versionSelect.value);
                if (version) {
                    selectVersion(version, true);
                }
            });
        }
        function update() {
            const showPreReleases = document.getElementById('include-prereleases')?.checked || false;
            const validVersions = versions.filter(v => showPreReleases || !v.isSnapshot);

            const selectedVersion = pickDefaultVersion(validVersions);
            if (selectedVersion) {
                selectVersion(selectedVersion);
            }
            for (const versionSelect of versionSelects) {
                versionSelect.value = selectedVersion?.id;
                versionSelect.disabled = !selectedVersion;
                versionSelect.replaceChildren(...validVersions.map(v => {
                    const option = document.createElement('option');
                    option.value = v.id;
                    option.innerText = `Minecraft ${v.id}`;
                    option.selected = v.id === selectedVersion?.id;
                    return option;
                }));
            }
        }

        update();
    });
}
