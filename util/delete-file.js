import {unlink} from "fs";
import {join} from "path";
import {__dirname} from "./variables.js";


export default async function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        unlink(join(__dirname, filePath), (error) => {
            if (error)
                reject("Something went wrong with deleting the file");
            else
                resolve();
        });
    });
}
