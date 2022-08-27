import {unlink} from "fs";
import {join} from "path";
import {__dirname} from "./variables.js";

import checkFileExistence from "./check-file-existance.js";


export default async function deleteFile(filePath) {
    const doesFileExist = await checkFileExistence(filePath);
    return new Promise((resolve, reject) => {
        if (doesFileExist) {
            unlink(join(__dirname, filePath), (error) => {
                if (error)
                    reject(new Error("Something went wrong with deleting the file"));
                else
                    resolve();
            });
        } else {
            resolve();
        }
    });
}
