import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as fs from 'fs';

dotenv.config();

export const headers = {
    'Accept': 'application/json',
    'x-api-key': process.env.API_KEY
};

export async function httpCall(url) {
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

export async function downloadFile(url, path) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Unexpected response: ${res.statusText}`);
    }
    res.body.pipe(fs.createWriteStream(path));
}