import { httpCall, downloadFile } from './js/httpUtils.js';

const BASE_URL = "https://api.curseforge.com";

const MINECRAFT_ID = 432;

async function getMinecraftVersions() {
    return await httpCall(`${BASE_URL}/v1/games/${MINECRAFT_ID}/versions`);
}

async function searchMod(searchFilter, pageSize) {
    return await httpCall(`${BASE_URL}/v1/mods/search?gameId=${MINECRAFT_ID}&sortOrder=desc&modLoaderType=1&sortField=2&searchFilter=${searchFilter}&pageSize=${pageSize}`);
}

async function getModFile(modId, minecraftVersion) {
    const modFiles = await httpCall(`${BASE_URL}/v1/mods/${modId}/files?gameVersion=${minecraftVersion}&pageSize=1`);
    return modFiles.data[0];
}

async function downloadMod(modId, minecraftVersion, path) {
    const mod = await getModFile(modId, minecraftVersion);
    await downloadFile(mod.downloadUrl, path + "/" + mod.fileName);
    console.log(`Mod ${modId} downloaded successfully`);
}