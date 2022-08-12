import express from "express";
import sequelize from "./util/database.js";
import {join} from "path";
import * as url from "url";
import bodyParser from "body-parser";

import personRouter from "./routes/person.js";

const server = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

server.use(bodyParser.urlencoded({ extended: true }));

// setting view engine and setting views directory
server.set("view engine", "ejs");
server.set("views", join(__dirname, "views"));

// setting static files directory with is ./public
server.use(express.static(join(__dirname, "public")));

// routing
server.use(personRouter);

//Error handler middleware
server.use((error, req, res, next) => {
    console.log(error.message);
    res.render("404", {errorMessage: error.message ? error.message : "Forbidden Request!"});
})

// run the application,
async function runTheApp() {
    try {
        console.log("_____________________________\nChecking database\n_____________________________");
        await sequelize.authenticate();
        const result = await sequelize.sync();
        // console.log('Connection has been established successfully.\n', result);
        server.listen(8080, () => {
            console.log("_____________________________\nApp Start");
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

runTheApp();