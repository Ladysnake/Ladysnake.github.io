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

/*TODO
    Functions:
   [X]  get project ID from some list
   [ ]  find latest file for each Minecraft version
   [ ]  compile into a dropdown
   [ ]  place dropdown into page
*/

// Init
const curse = {
    "requiem": "265729",
    "illuminations": "292908",
    "illuminationsForge": "351392",
    "creeperspores": "331636",
    "nomadbooks": "356921",
    "beem": "358105",
    "blast": "349938",
    "impersonate": "360333"
};
const tempJSON = {
    "id": 265729,
    "name": "Requiem",
    "authors": [
      {
        "name": "PyrofabTheModsmith",
        "url": "https://www.curseforge.com/members/18526954-pyrofabthemodsmith?username=pyrofabthemodsmith",
        "projectId": 265729,
        "id": 162224,
        "projectTitleId": null,
        "projectTitleTitle": null,
        "userId": 18526954,
        "twitchId": 167659490
      },
      {
        "name": "doctor4t",
        "url": "https://www.curseforge.com/members/33024798-doctor4t?username=doctor4t",
        "projectId": 265729,
        "id": 163547,
        "projectTitleId": 2,
        "projectTitleTitle": "Author",
        "userId": 33024798,
        "twitchId": 125738209
      }
    ],
    "attachments": [
      {
        "id": 96178,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/96/178/256/256/636282892372189675.png",
        "title": "636282892372189675.png",
        "url": "https://media.forgecdn.net/avatars/96/178/636282892372189675.png",
        "status": 1
      },
      {
        "id": 139450,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/139/450/256/256/636528325486896818.png",
        "title": "636528325486896818.png",
        "url": "https://media.forgecdn.net/avatars/139/450/636528325486896818.png",
        "status": 1
      },
      {
        "id": 173993,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/173/993/256/256/636747602899517538.png",
        "title": "636747602899517538.png",
        "url": "https://media.forgecdn.net/avatars/173/993/636747602899517538.png",
        "status": 1
      },
      {
        "id": 200829,
        "projectId": 265729,
        "description": "",
        "isDefault": true,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/200/829/256/256/636916210358495448.png",
        "title": "636916210358495448.png",
        "url": "https://media.forgecdn.net/avatars/200/829/636916210358495448.png",
        "status": 1
      },
      {
        "id": 116438,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/116/438/256/256/636398380381319408.png",
        "title": "636398380381319408.png",
        "url": "https://media.forgecdn.net/avatars/116/438/636398380381319408.png",
        "status": 1
      },
      {
        "id": 131670,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/131/670/256/256/636469332124255943.png",
        "title": "636469332124255943.png",
        "url": "https://media.forgecdn.net/avatars/131/670/636469332124255943.png",
        "status": 1
      },
      {
        "id": 146023,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/146/23/256/256/636567044062160886.png",
        "title": "636567044062160886.png",
        "url": "https://media.forgecdn.net/avatars/146/23/636567044062160886.png",
        "status": 1
      },
      {
        "id": 146024,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/146/24/256/256/636567044326852225.png",
        "title": "636567044326852225.png",
        "url": "https://media.forgecdn.net/avatars/146/24/636567044326852225.png",
        "status": 1
      },
      {
        "id": 137457,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/137/457/256/256/636515150087692702.png",
        "title": "636515150087692702.png",
        "url": "https://media.forgecdn.net/avatars/137/457/636515150087692702.png",
        "status": 1
      },
      {
        "id": 123428,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/123/428/256/256/636414893864042201.png",
        "title": "636414893864042201.png",
        "url": "https://media.forgecdn.net/avatars/123/428/636414893864042201.png",
        "status": 1
      },
      {
        "id": 106788,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/avatars/thumbnails/106/788/256/256/636361734864768563.png",
        "title": "636361734864768563.png",
        "url": "https://media.forgecdn.net/avatars/106/788/636361734864768563.png",
        "status": 1
      },
      {
        "id": 243961,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/attachments/thumbnails/243/961/310/172/2019-01-06_21.png",
        "title": "A soul player",
        "url": "https://media.forgecdn.net/attachments/243/961/2019-01-06_21.png",
        "status": 1
      },
      {
        "id": 243964,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/attachments/thumbnails/243/964/310/172/2019-01-06_21.png",
        "title": "Possessed baby husk - third person",
        "url": "https://media.forgecdn.net/attachments/243/964/2019-01-06_21.png",
        "status": 1
      },
      {
        "id": 243963,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/attachments/thumbnails/243/963/310/172/2019-01-06_21.png",
        "title": "Possessed baby husk - first person",
        "url": "https://media.forgecdn.net/attachments/243/963/2019-01-06_21.png",
        "status": 1
      },
      {
        "id": 243962,
        "projectId": 265729,
        "description": "",
        "isDefault": false,
        "thumbnailUrl": "https://media.forgecdn.net/attachments/thumbnails/243/962/310/172/2019-01-06_21.png",
        "title": "Mod compatibility",
        "url": "https://media.forgecdn.net/attachments/243/962/2019-01-06_21.png",
        "status": 1
      }
    ],
    "websiteUrl": "https://www.curseforge.com/minecraft/mc-mods/requiem",
    "gameId": 432,
    "summary": "Completely changes the vanilla death system by adding new mechanics such as player souls and undead possession.",
    "defaultFileId": 2855895,
    "downloadCount": 77366.0,
    "latestFiles": [
      {
        "id": 2839183,
        "fileName": "requiem-1.1.0-pre1.jar",
        "fileDate": "2019-12-10T00:41:34",
        "releaseType": 3,
        "fileStatus": 4,
        "downloadUrl": "https://edge.forgecdn.net/files/2839/183/requiem-1.1.0-pre1.jar",
        "isAlternate": false,
        "alternateFileId": 0,
        "dependencies": [
          { "addonId": 306612, "type": 3 },
          { "addonId": 318449, "type": 1 }
        ],
        "isAvailable": true,
        "modules": [
          { "fingerprint": 3571781624, "foldername": "LICENSE-ART" },
          { "fingerprint": 3804980824, "foldername": "LICENSE-CODE" },
          { "fingerprint": 9965814, "foldername": "pack.mcmeta" },
          {
            "fingerprint": 3692104204,
            "foldername": "mixins.requiem.common.json"
          },
          {
            "fingerprint": 1391051466,
            "foldername": "mixins.requiem.client.json"
          },
          { "fingerprint": 1816950306, "foldername": "fabric.mod.json" },
          { "fingerprint": 491885524, "foldername": "data" },
          { "fingerprint": 4071875855, "foldername": "assets" },
          { "fingerprint": 3304041959, "foldername": "Requiem-refmap.json" },
          { "fingerprint": 2432511081, "foldername": "META-INF" },
          { "fingerprint": 2413739833, "foldername": "ladysnake" }
        ],
        "packageFingerprint": 1405866104,
        "gameVersion": ["1.15-Snapshot", "Fabric", "1.15"],
        "installMetadata": null,
        "serverPackFileId": null,
        "fileLength": 565200
      },
      {
        "id": 2845521,
        "fileName": "Dissolution-1.12.2-0.3.12.jar",
        "fileDate": "2019-12-19T23:52:31",
        "releaseType": 2,
        "fileStatus": 4,
        "downloadUrl": "https://edge.forgecdn.net/files/2845/521/Dissolution-1.12.2-0.3.12.jar",
        "isAlternate": false,
        "alternateFileId": 0,
        "dependencies": [{ "addonId": 307304, "type": 1 }],
        "isAvailable": true,
        "modules": [
          { "fingerprint": 3980121666, "foldername": "META-INF" },
          { "fingerprint": 3938711015, "foldername": "ladysnake" },
          { "fingerprint": 3977742876, "foldername": "assets" },
          { "fingerprint": 792874087, "foldername": "mcmod.info" },
          { "fingerprint": 2903927881, "foldername": "pack.mcmeta" }
        ],
        "packageFingerprint": 3345956736,
        "gameVersion": ["1.12.2"],
        "installMetadata": null,
        "serverPackFileId": null,
        "fileLength": 570608
      },
      {
        "id": 2855895,
        "fileName": "requiem-1.1.4.jar",
        "fileDate": "2020-01-06T23:26:46",
        "releaseType": 1,
        "fileStatus": 4,
        "downloadUrl": "https://edge.forgecdn.net/files/2855/895/requiem-1.1.4.jar",
        "isAlternate": false,
        "alternateFileId": 0,
        "dependencies": [
          { "addonId": 306612, "type": 3 },
          { "addonId": 318449, "type": 1 },
          { "addonId": 323710, "type": 1 }
        ],
        "isAvailable": true,
        "modules": [
          { "fingerprint": 3571781624, "foldername": "LICENSE-ART" },
          { "fingerprint": 3804980824, "foldername": "LICENSE-CODE" },
          { "fingerprint": 9965814, "foldername": "pack.mcmeta" },
          {
            "fingerprint": 1734373441,
            "foldername": "mixins.requiem.common.json"
          },
          {
            "fingerprint": 2144000513,
            "foldername": "mixins.requiem.client.json"
          },
          { "fingerprint": 4264353656, "foldername": "fabric.mod.json" },
          { "fingerprint": 2205457882, "foldername": "data" },
          { "fingerprint": 4071875855, "foldername": "assets" },
          { "fingerprint": 1749316371, "foldername": "requiem-refmap.json" },
          { "fingerprint": 900985955, "foldername": "META-INF" },
          { "fingerprint": 381217258, "foldername": "ladysnake" }
        ],
        "packageFingerprint": 2735535802,
        "gameVersion": ["Fabric", "1.15", "1.15.1"],
        "installMetadata": null,
        "serverPackFileId": null,
        "fileLength": 798407
      }
    ],
    "categories": [
      {
        "categoryId": 419,
        "name": "Magic",
        "url": "https://www.curseforge.com/minecraft/mc-mods/magic",
        "avatarUrl": "https://media.forgecdn.net/avatars/6/34/635351496247862494.png"
      },
      {
        "categoryId": 421,
        "name": "API and Library",
        "url": "https://www.curseforge.com/minecraft/mc-mods/library-api",
        "avatarUrl": "https://media.forgecdn.net/avatars/6/36/635351496947765531.png"
      },
      {
        "categoryId": 425,
        "name": "Miscellaneous",
        "url": "https://www.curseforge.com/minecraft/mc-mods/mc-miscellaneous",
        "avatarUrl": "https://media.forgecdn.net/avatars/6/40/635351497693711265.png"
      },
      {
        "categoryId": 4780,
        "name": "Fabric",
        "url": "https://www.curseforge.com/minecraft/mc-mods/fabric",
        "avatarUrl": "https://media.forgecdn.net/avatars/182/502/636808438426582276.png"
      },
      {
        "categoryId": 422,
        "name": "Adventure and RPG",
        "url": "https://www.curseforge.com/minecraft/mc-mods/adventure-rpg",
        "avatarUrl": "https://media.forgecdn.net/avatars/6/37/635351497295252123.png"
      }
    ],
    "status": 4,
    "categorySection": {
      "id": 8,
      "gameId": 432,
      "name": "Mods",
      "packageType": 6,
      "path": "mods",
      "initialInclusionPattern": ".",
      "extraIncludePattern": null,
      "gameCategoryId": 6
    },
    "slug": "requiem",
    "gameVersionLatestFiles": [
      {
        "gameVersion": "1.15",
        "projectFileId": 2855895,
        "projectFileName": "requiem-1.1.4.jar",
        "fileType": 1
      },
      {
        "gameVersion": "1.15.1",
        "projectFileId": 2855895,
        "projectFileName": "requiem-1.1.4.jar",
        "fileType": 1
      },
      {
        "gameVersion": "1.12.2",
        "projectFileId": 2845521,
        "projectFileName": "Dissolution-1.12.2-0.3.12.jar",
        "fileType": 2
      },
      {
        "gameVersion": "1.15",
        "projectFileId": 2841311,
        "projectFileName": "requiem-1.1.0-pre2.jar",
        "fileType": 2
      },
      {
        "gameVersion": "1.15",
        "projectFileId": 2839183,
        "projectFileName": "requiem-1.1.0-pre1.jar",
        "fileType": 3
      },
      {
        "gameVersion": "1.14.4",
        "projectFileId": 2808826,
        "projectFileName": "requiem-1.0.1.jar",
        "fileType": 1
      },
      {
        "gameVersion": "1.12.2",
        "projectFileId": 2620898,
        "projectFileName": "Dissolution-1.12.2-0.1.5-resurrection.jar",
        "fileType": 3
      },
      {
        "gameVersion": "1.12.1",
        "projectFileId": 2530729,
        "projectFileName": "dissolution-1.12-0.6.1.jar",
        "fileType": 3
      },
      {
        "gameVersion": "1.11.2",
        "projectFileId": 2502854,
        "projectFileName": "dissolution-0.5.4-mc1.11.2.jar",
        "fileType": 3
      },
      {
        "gameVersion": "1.12",
        "projectFileId": 2461048,
        "projectFileName": "dissolution-0.4.2.3.jar",
        "fileType": 3
      },
      {
        "gameVersion": "1.10.2",
        "projectFileId": 2425170,
        "projectFileName": "dissolution-0.3.0.jar",
        "fileType": 3
      }
    ],
    "popularityScore": 660.0882,
    "gamePopularityRank": 3993,
    "gameName": "Minecraft",
    "portalName": "www.curseforge.com",
    "dateModified": "2020-01-06T23:38:38",
    "dateCreated": "2017-04-20T17:47:17",
    "dateReleased": "2020-01-06T23:26:48",
    "isAvailable": true,
    "primaryLanguage": "enUS",
    "isFeatured": false
  };
let data;
let desc;
let down = document.getElementById("mod-dropdown");

/**
 * Gets the ID(s) of a mod based on the list above
 * @param {String} modname Name of the mod according to the webpage
 */
function getID(modname) { return curse[modname]; }
/**
 * Gets the files for the mod <p>
 * Requires the CurseForge description to contain the version list prefixed with
 * <code>Versions:</code>
 * @param {String} curseID Project ID, probably gotten from the above function
 */
function getFile(curseID) {
    $.getJSON(`https://curse.nikky.moe/api/addon/${curseID}`, function(a) {data = a;});
    $.get(`https://curse.nikky.moe/api/addon/${curseID}/description`, function(a) {desc = a;});
    setTimeout(function(){
        if(/versions:/i.test(desc)) {
            desc = desc.slice(desc.indexOf("ersions:"), desc.indexOf("ersions:") + 250);    
            let reg = /[0-9]\.[0-9]+(\.[0-9]*)*/g;
            let versions = desc.match(reg);
            for (let v in versions) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = `https://curse.nikky.moe/api/url/${curseID}?version=${versions[v]}`;
                a.innerHTML = versions[v];
                li.appendChild(a);
                down.appendChild(li);
            }
        }
    }, 500);
}

let i = 0;

function doTheThing() { if (i++ == 0) getFile(getID(mod.split(".")[0])); }

mod = window.location.href.split("/wiki/")[1];
getFile(getID(mod.split(".")[0]));
