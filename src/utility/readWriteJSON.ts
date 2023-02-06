import * as fs from 'fs';
import * as path from 'path';

class FileSystem {
    constructor() {

    }

    public static readFile<T>(location: string):Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                const rawdata: any = fs.readFileSync(path.resolve(__dirname, location), "utf8");
                const jsonData = JSON.parse(rawdata);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        });
    }

    public static writeFile(location: string, data: any) {
        return new Promise((resolve, reject) => {
            try {
                const stringifyData = JSON.stringify(data, null, 4);
                fs.writeFileSync(path.resolve(__dirname, location), stringifyData);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
}

const ReadFile = FileSystem.readFile;
const WriteFile = FileSystem.writeFile;

export {
    ReadFile,
    WriteFile,
}