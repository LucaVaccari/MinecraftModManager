import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as fs from 'fs';

dotenv.config();

const BASE_URL = "https://api.curseforge.com";

const MINECRAFT_ID = 432;
const headers = {
    'Accept': 'application/json',
    'x-api-key': process.env.API_KEY
};
const DOWNLOAD_PATH = "C://users/asus/Desktop";

async function httpCall(url) {
    try {
        const res = await fetch(url, { headers });
        if (res.status == 403) {
            console.error("Error 403: not permitted");
            return;
        }
        const json = await res.json();
        return json;
    } catch (e) {
        console.log(e.message);
    }
}

async function searchMod(searchFilter, pageSize) {
    return await httpCall(`${BASE_URL}/v1/mods/search?gameId=${MINECRAFT_ID}&sortOrder=desc&modLoaderType=1&sortField=2&searchFilter=${searchFilter}&pageSize=${pageSize}`);
}

async function downloadMod(modId, minecraftVersion, path) {
    const modFiles = await httpCall(`${BASE_URL}/v1/mods/${modId}/files?gameVersion=${minecraftVersion}&pageSize=1`);
    const mod = modFiles.data[0];

    const res = await fetch(mod.downloadUrl);
    if (!res.ok) {
        throw new Error(`Unexpected response: ${res.statusText}`);
    }
    res.body.pipe(fs.createWriteStream(path + "/" + mod.fileName));
    console.log(`Mod ${modId} downloaded successfully`);
}

(async () => {
    const mods = await searchMod("thaumcraft", 1);
    const modId = mods.data[0].id;
    downloadMod(modId, "1.7.10", DOWNLOAD_PATH);
})();
