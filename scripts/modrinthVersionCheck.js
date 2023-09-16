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

            const obj = versions.get(gameVersion);

            obj.versions.push({ version: modrinthVersion.version_number, name: modrinthVersion.name, modrinthId: modrinthVersion.id });
        });
    });

    const versionsArray = Array.from(versions, ([id, value]) => ({
        id,
        releaseTime: new Date(pistonMeta.get(id)?.releaseTime || 0),
        isSnapshot: pistonMeta.get(id)?.type !== 'release',
        ...value,
    }));

    versionsArray.sort((a, b) => b.releaseTime - a.releaseTime);
    return versionsArray;
}
