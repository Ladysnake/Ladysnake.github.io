import {compareMcVersions, getVersions, type GroupedVersionSet, type ModRef, type VersionSet} from "./modrinth-api.js";

function pickDefaultVersion(versions: Map<string, GroupedVersionSet>): GroupedVersionSet|undefined {
  const pinned = new URL(window.location.href).searchParams.get('version');
  if (pinned && versions.has(pinned)) {
    return versions.get(pinned);
  }

  return versions.values().next().value;
}

function indexVersions(
    projectVersions: [ModRef, Map<string, VersionSet>][],
    primaryMod?: string,
): Map<string, GroupedVersionSet> {
  const result = new Map<string, GroupedVersionSet>();
  for (const [mod, versions] of projectVersions) {
    for (const [mcVersionId, {mcVersion, modVersions}] of versions) {
      if (!result.has(mcVersionId)) result.set(mcVersionId, {
        mcVersion,
        modVersions: new Map(),
      });
      result.get(mcVersionId)!.modVersions.set(mod, modVersions);
    }
  }
  return new Map([...result].filter(([_, v]) => primaryMod == null || v.modVersions.has(primaryMod)).sort(compareMcVersions));
}

function doReplaceVersion(modName: string, version: string) {
  for (const e of document.getElementsByClassName(`mod-version-${modName}`) as Iterable<HTMLElement>) {
    e.innerText = version;
  }
}

function doReplaceMavenGroup(modName: string, mavenGroup: string) {
  for (const e of document.getElementsByClassName(`maven-group-${modName}`) as Iterable<HTMLElement>) {
    e.innerText = mavenGroup;
  }
}

function doReplaceCcaModule(module: string) {
  for (const e of document.getElementsByClassName(`cca-module-template`) as Iterable<HTMLElement>) {
    e.innerText = module;
  }
}

function getMavenGroup(modName: string, modVersion?: string): string|undefined {
  if (modName === 'cca') {
    if (modVersion == null) return 'io.github.onyxstudios';
    const major = +(modVersion.split('.')[0]);
    if (major < 4) {
      return '`see table below`';
    } else if (major < 6) {
      return 'dev.onyxstudios';
    } else {
      return 'org.ladysnake';
    }
  }
}

function selectVersion(version: GroupedVersionSet, mods: string[], pin?: boolean) {
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
    doReplaceMavenGroup(modName, getMavenGroup(modName, modVersion) ?? `<${modName.toLocaleUpperCase()}_MAVEN_GROUP>`);
  }
}

function updateVersionSelects(projectVersions: Map<string, GroupedVersionSet>, mods: string[]) {
  const showPreReleases = (document.getElementById('include-prereleases') as HTMLInputElement)?.checked || false;
  const validVersions = new Map<string, GroupedVersionSet>([...projectVersions]
      .filter(([_, { mcVersion }]) => showPreReleases || !mcVersion.isSnapshot));

  const selectedVersion = pickDefaultVersion(validVersions);
  if (selectedVersion) {
    selectVersion(selectedVersion, mods);
  }
  for (const versionSelect of document.getElementsByClassName('mc-version-select') as Iterable<HTMLSelectElement>) {
    versionSelect.value = '';
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
 * @param modrinthProjectIds
 * @param showAllVersions if false, only the MC version relevant to the first mod in modrinthProjectIds will be displayed
 */
export async function setUpSmartBuildscript(
    modrinthProjectIds: Record<string, string>,
    showAllVersions?: boolean,
): Promise<void> {
  for (let controls of document.getElementsByClassName('smart-buildscript-controls')) {
    (controls as HTMLElement).hidden = false;
    for (let radio of controls.querySelectorAll('input[name=cca-module-picker]') as Iterable<HTMLInputElement>) {
      radio.addEventListener('change', e => radio.checked && doReplaceCcaModule(radio.value));
    }
  }
  const mods = Object.keys(modrinthProjectIds);
  const projectVersions = indexVersions(await Promise.all(
      Object.entries(modrinthProjectIds).map(
          ([mod, modrinthProjectId]) =>
              getVersions(modrinthProjectId).then((v) => [mod, v])
      ) as Promise<[ModRef, Map<string, VersionSet>]>[]
  ), showAllVersions ? undefined : mods[0]);

  for (const versionSelect of document.getElementsByClassName('mc-version-select') as Iterable<HTMLSelectElement>) {
    versionSelect.addEventListener('change', () => {
      if (projectVersions.has(versionSelect.value)) {
        selectVersion(projectVersions.get(versionSelect.value)!, mods, true);
      }
    });
  }

  updateVersionSelects(projectVersions, mods);
}
