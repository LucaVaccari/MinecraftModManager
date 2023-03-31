import * as cf from './js/curseforge.js';
import * as fs from 'fs';

let versions;

const helpCommands = {
    search: {
        description: 'Search for a mod id based on a filter.',
        usage: 'search <filter> <?number-of-results>'
    },
    execute: {
        description: 'Downloads/updated the modes based on a script',
        usage: 'execute <path>'
    },
    download: {
        description: 'Downloads a mod.',
        usage: 'download <modId> <gameVersion> <path>'
    }
};

function printWrongSyntaxMessage(command) {
    console.log('Wrong syntax. Usage: ' + helpCommands[command].usage);
}

async function search(args) {
    // <filter> <?number-of-results>
    if (!args[1]) {
        printWrongSyntaxMessage('search');
        return;
    }

    const results = await cf.searchMod(args[1] || "", args[2] || 10);
    results.data.forEach(e => {
        console.log(`${e.id} - ${e.name} (${e.slug})`);
    });
}

async function execute(args) {
    // <path>
    if (!args[1]) {
        printWrongSyntaxMessage('execute');
        return;
    }

    // READ JSON FILE
    try {
        const rawScript = fs.readFileSync(args[1]);
        const script = JSON.parse(rawScript);

        // script.modList.forEach(mod => {
        //     const currentModPath = script.savePath + '/' + mod.fileName;
        //     const folderName = new Date().toISOString().replaceAll(':', '.');
        //     const newFolder = script.savePath + '/' + folderName;
        //     const newModPath = newFolder + '/' + mod.fileName + '.disabled';

        //     if (!fs.existsSync(newFolder) && fs.existsSync(currentModPath)) fs.mkdirSync(newFolder);

        //     fs.rename(currentModPath, newModPath, err => { if (err) console.error(err); });
        // });

        // todo: DOWNLOAD NEW MODS
        script.modList.forEach(mod => {
            const path = script.savePath + '/' + mod.fileName;
            cf.downloadMod(mod.id, script.gameVersion, path);
        });
    } catch (e) {
        console.error(e);
    }

}

async function download(args) {
    // <modId> <gameVersion> <path>
    if (!args[1] || !args[2] || !args[3]) {
        printWrongSyntaxMessage('download');
        return;
    }
    if (!versions.has(args[2])) {
        console.error("The selected MC version does not exist.");
        return;
    }
    try {
        await cf.downloadMod(args[1], args[2], args[3]);
        console.log(`Mod ${args[1]} downloaded successfully`);
    } catch (e) {
        console.error(e);
    }
}

(async () => {
    // const mods = await searchMod("thaumcraft", 1);
    // const modId = mods.data[0].id;
    // downloadMod(modId, "1.7.10", DOWNLOAD_PATH);

    const versionsRaw = await cf.getMinecraftVersions();
    versions = new Set(versionsRaw.data.reduce(
        (accumulator, currentVal) => accumulator.concat(currentVal.versions), []));

    const args = process.argv.slice(2);
    const command = args[0];
    switch (command) {
        case 'search':
            await search(args);
            break;
        case 'execute':
            await execute(args);
            break;
        case 'download':
            await download(args);
            break;
        case 'help':
            if (!args[1]) {
                console.log(Object.keys(helpCommands).join(", "));
                console.log('Use \'help <command>\' for a detailed description of the command');
            } else {
                const helpCommand = helpCommands[args[1]];
                if (!helpCommand)
                    console.error('The command does not exist. Try \'help\' for a list of commands.');
                console.log(helpCommand.description);
                console.log('Usage: ' + helpCommand.usage);
            }
            break;
        default:
            console.error('Unrecognized command. Try \'help\' for a list of commands');
            break;
    }
})();
