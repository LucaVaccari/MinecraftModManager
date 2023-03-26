import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const BASE_URL = "https://api.curseforge.com";
const MINECRAFT_ID = 432;

(async () => {
    try {
        const headers = {
            'Accept': 'application/json',
            'x-api-key': process.env.API_KEY
        };
        const res = await fetch(`${BASE_URL}/v1/mods/search?gameId=${MINECRAFT_ID}&gameVersion=1.19.2&searchFilter=jei&pageSize=5`, { headers });
        if (res.status == 403) console.error("403");
        const json = await res.json();
        console.log(json);
    } catch (e) {
        console.log(e.message);
    }
})();
