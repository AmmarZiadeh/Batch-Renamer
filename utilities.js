const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const system = {
    "input":
        async (question) => {
            return new Promise((resolve) => {
                readline.question(question, (answer) => {
                    resolve(answer);
                });
            });
        },
    "close":
        () => {
            readline.close();
        }
};

const fileSystem = {
    "isDirectory":
        async (directoryPath) => {
            fs.stat(directoryPath, (err, stats) => {
                if(err) {
                    if(err.code === "ENOENT") {
                        console.log("The directory does not exist.");
                    }
                    throw err;
                }
                
                if(!stats.isDirectory()) {
                    throw new Error("The path is not a directory.");
                }
            });
        },
    "isFile":
        async (filePath) => {
            fs.stat(filePath, (err, stats) => {
                if(err) {
                    console.log("Error checking the file path.");
                    throw err;
                }
                
                if(!stats.isFile()) {
                    throw new Error("The path is not a file.");
                }
            });
        },
    "isFileSync":
        (filePath) => {
            try {
                const stats = fs.statSync(filePath);

                if(!stats.isFile()) {
                    throw new Error("The path is not a file.");
                }
            } catch(err) {
                console.log("Error checking the file path.");
                throw err;
            }
        },
    "isValidFileName":
        async (fileName) => {
            const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;
            const reservedNames = [
                'CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4',
                'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2',
                'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
            ];
            
            if (invalidChars.test(fileName))
                { throw new Error("The file name contains an invalid character."); }
            if (reservedNames.includes(fileName.toUpperCase()))
                { throw new Error("The file name contains an reserved name."); }
            if (fileName.length === 0 || fileName.length > 255)
                { throw new Error("The file name has an incorrect length."); }
        },
    "toAbsolute":
        async (directoryPath) => {
            return path.resolve(directoryPath);
        },
    "readDirectory":
        async (directoryPath) => {
            try {
                const files = fs.readdirSync(directoryPath);
                const absolutePaths = files.map(file => path.resolve(directoryPath, file));
                return absolutePaths;
            } catch (err) {
                console.log("Unable to scan directory.");
                throw err;
            }
        },
    "filterFiles":
        async (files) => {
            return files.filter(file => fs.statSync(file).isFile());
        },
    "renameFiles":
        async (files, newFileBase, COUNTERSTARTNUM=1, COUNTERPADLENGTH=2) => {
            let counter = COUNTERSTARTNUM;
            let fileExtPos = -1;
            let fileExt = "";
            let fileCounter = "";
            let dirName = "";
            let fileName = "";
            let newFileName = "";

            files.forEach((file) => {
                fileSystem.isFileSync(file);

                dirName = path.dirname(file);
                fileName = path.basename(file);

                fileExtPos = fileName.lastIndexOf('.');
                fileExt = fileExtPos < 0 ? null : fileName.substring(fileExtPos);
                fileCounter = `${counter}`.padStart(COUNTERPADLENGTH, '0');
                
                newFileName = newFileBase + fileCounter + fileExt;
                
                try {
                    fs.renameSync(path.join(dirName, fileName), path.join(dirName, newFileName));
                    console.log(`Renamed file '${fileName}' to '${newFileName}'`);
                } catch(err) {
                    console.error(`Unable to rename file: ${err}`);
                }
                
                counter++;
            });
        }
};

function isValidNumber(str) {
    if(isNaN(parseFloat(str)) || !isFinite(str)) {
        throw new Error("The number is not valid.");
    }
}

module.exports = {system, fileSystem, isValidNumber};
