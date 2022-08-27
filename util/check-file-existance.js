import {access, constants} from "fs";


export default async function checkFileExistence(filePath) {
    return new Promise((resolve, reject) => {
        access(filePath, constants.F_OK, err => {
            if (err)
                resolve(false);
            else
                resolve(true);
        });
    });
}

