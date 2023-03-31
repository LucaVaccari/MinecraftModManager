import * as cf from './js/curseforge.js';

const DOWNLOAD_PATH = "C://users/asus/Desktop";

const helpCommands = {
    search: {
        description: 'Search for a mod id based on a filter.',
        usage: 'search <filter> <?number-of-results>'
    },
    download: {
        description: 'Downloads a mod.',
        usage: 'download <modId> <gameVersion> <path>'
    }
};

function printWrongSyntaxMessage(command) {
    console.log('Wrong syntax. Usage: ' + helpCommands[command].usage);
}

(async () => {
    // const mods = await searchMod("thaumcraft", 1);
    // const modId = mods.data[0].id;
    // downloadMod(modId, "1.7.10", DOWNLOAD_PATH);

    const versionsRaw = await cf.getMinecraftVersions();
    const versions = new Set(versionsRaw.data.reduce(
        (accumulator, currentVal) => accumulator.concat(currentVal.versions), []));

    const args = process.argv.slice(2);
    const command = args[0];
    switch (command) {
        case 'search':
            // <filter> <?number-of-results>
            if (!args[1]) {
                printWrongSyntaxMessage('search');
                break;
            }
            const results = await cf.searchMod(args[1] || "", args[2] || 10);
            results.data.forEach(e => {
                console.log(`${e.id} - ${e.name} (${e.slug})`);
            });
            break;
        case 'download':
            // <modId> <gameVersion> <path>
            if (!args[1] || !args[2] || !args[3]) {
                printWrongSyntaxMessage('download');
                break;
            }
            if (!versions.has(args[2])) {
                console.error("The selected MC version does not exist.");
                break;
            }
            try {
                cf.downloadMod(args[1], args[2], args[3]);
                console.log(`Mod ${args[1]} downloaded successfully`);
            } catch (e) {
                console.error(e);
            }
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
