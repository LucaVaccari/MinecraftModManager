import { httpCall, downloadFile } from './httpUtils.js';

const BASE_URL = "https://api.curseforge.com";

const MINECRAFT_ID = 432;

export async function getMinecraftVersions() {
    return await httpCall(`${BASE_URL}/v1/games/${MINECRAFT_ID}/versions`);
}

export async function searchMod(searchFilter, pageSize) {
    return await httpCall(`${BASE_URL}/v1/mods/search?gameId=${MINECRAFT_ID}&sortOrder=desc&modLoaderType=1&sortField=2&searchFilter=${searchFilter}&pageSize=${pageSize}`);
}

export async function getModFile(modId, minecraftVersion) {
    const modFiles = await httpCall(`${BASE_URL}/v1/mods/${modId}/files?gameVersion=${minecraftVersion}&pageSize=1`);
    if (!modFiles) return undefined;
    return modFiles.data[0];
}

export async function downloadMod(modId, minecraftVersion, path) {
    const mod = await getModFile(modId, minecraftVersion);
    if (!mod)
        throw new Error('File not found for the selected version. Try another version');
    else
        await downloadFile(mod.downloadUrl, path + "/" + mod.fileName);
}