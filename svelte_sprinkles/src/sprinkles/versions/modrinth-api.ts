function handleRequestTask(req: Promise<Response>): Promise<any> {
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

export const compareMcVersions = (a: [string, McIndexedVersion], b: [string, McIndexedVersion]) => {
    return +(b[1].mcVersion.releaseTime) - +(a[1].mcVersion.releaseTime);
};

export interface MojangVersion {
  id: string;
  releaseTime: number;
  type: string;
}

export interface ModrinthVersion {
  name: string;
  version_number: string;
  date_published: string;
  changelog?: string | null;
  dependencies: Object[];
  game_versions: string[];
  version_type: string;
  loaders: string[];
  featured: boolean;
  id: string;
}
export type ModRef = string;

export interface ModVersion {
  name: string;
  version: string;
  modrinthId: string;
  loaders: string[];
}

export interface McVersion {
  id: string;
  releaseTime: Date;
  isSnapshot: boolean;
}

export interface McIndexedVersion {
  mcVersion: McVersion
}

export interface VersionSet extends McIndexedVersion {
  mcVersion: McVersion;
  modVersions: ModVersion[];
}

export interface GroupedVersionSet extends McIndexedVersion {
  mcVersion: McVersion;
  modVersions: Map<ModRef, ModVersion[]>;
}

export async function getVersions(modrinthProjectId: string): Promise<Map<string, VersionSet>> {

    // start both requests in parallel for extra speed
    const pistonMetaTask = fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json');
    const modrinthTask = fetch(`https://api.modrinth.com/v2/project/${modrinthProjectId}/version`);

    const modrinth: ModrinthVersion[] = await handleRequestTask(modrinthTask);
    // sort versions by release date. this is probably™ fine as we split by MC version later
    modrinth.sort((a, b) => Date.parse(b.date_published) - Date.parse(a.date_published));

    const pistonMeta = await handleRequestTask(pistonMetaTask).then(obj => {
        const map = new Map<string, MojangVersion>();
        obj.versions.forEach((version: MojangVersion) => {
            map.set(version.id, version);
        });
        return map;
    });

    const versions = new Map<string, ModVersion[]>();
    modrinth.forEach(modrinthVersion => {
        modrinthVersion.game_versions.forEach(gameVersion => {
            if (!versions.has(gameVersion)) {
                versions.set(gameVersion, []);
            }

            versions.get(gameVersion)!.push({
                version: modrinthVersion.version_number,
                name: modrinthVersion.name,
                modrinthId: modrinthVersion.id,
                loaders: modrinthVersion.loaders,
            });
        });
    });

  const versionSets: [string, VersionSet][] = Array.from(versions, ([id, versions]) => [id, {
    mcVersion: {
      id,
      releaseTime: new Date(pistonMeta.get(id)?.releaseTime || 0),
      isSnapshot: pistonMeta.get(id)?.type !== 'release',
    },
    modVersions: versions,
  }]);
  return new Map(versionSets.sort(compareMcVersions));
}
