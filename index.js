const fs = require('fs');
const {system, fileSystem, isValidNumber} = require('./utilities.js');

async function main() {
    const directoryPath = await system.input("Enter directory path: ");
    await fileSystem.isDirectory(directoryPath);

    const newFileBase = await system.input("Enter new file name: ");
    await fileSystem.isValidFileName(newFileBase);

    const COUNTERSTARTNUM = await system.input("Enter counter starting number: ");
    isValidNumber(COUNTERSTARTNUM);

    const COUNTERPADLENGTH = await system.input("Enter counter padding length: ");
    isValidNumber(COUNTERPADLENGTH);

    // Print file previews
    console.log(`\nDirectory Path: ${await fileSystem.toAbsolute(directoryPath)}`);
    console.log(`Example: Renamed example.txt to ${newFileBase}.txt`);
    const correct = await system.input("Is this format correct (Y/N)? ");

    system.close();

    if(correct.toLowerCase() === "yes" || correct.toLowerCase() === 'y') {
        let files = await fileSystem.readDirectory(directoryPath);
        files = await fileSystem.filterFiles(files);
        await fileSystem.renameFiles(files, newFileBase, COUNTERSTARTNUM, COUNTERPADLENGTH);
    } else {
        console.log("Could not complete file renaming!");
    }
}

main();
