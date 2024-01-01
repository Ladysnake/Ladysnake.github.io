/**
 * @param {Promise<Response>} req
 * @returns {Promise<any>}
 */
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

export const compareMcVersions = (a, b) => {
    return b[1].mcVersion.releaseTime - a[1].mcVersion.releaseTime;
};

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
 * @typedef {string} ModRef
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
 */

/**
 * @param {string} modrinthProjectId
 * @returns {Promise<Map<string, {mcVersion: McVersion, modVersions: ModVersion[]}>>}
 */
export async function getVersions(modrinthProjectId) {

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

    /** @type {Map<string, ModVersion[]>}*/
    const versions = new Map();
    modrinth.forEach(modrinthVersion => {
        modrinthVersion.game_versions.forEach(gameVersion => {
            if (!versions.has(gameVersion)) {
                versions.set(gameVersion, []);
            }

            versions.get(gameVersion).push({ version: modrinthVersion.version_number, name: modrinthVersion.name, modrinthId: modrinthVersion.id });
        });
    });

    return new Map(Array.from(versions, ([id, versions]) => ([id, {
        mcVersion: {
            id,
            releaseTime: new Date(pistonMeta.get(id)?.releaseTime || 0),
            isSnapshot: pistonMeta.get(id)?.type !== 'release',
        },
        modVersions: versions,
    }])).sort(compareMcVersions));
}
