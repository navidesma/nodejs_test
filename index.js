import express from "express";
import sequelizeInstance from "./util/database.js";
import {join} from "path";
import * as url from "url";
import session from "express-session";
import postgresSessionStore from "connect-pg-simple";

import Person from "./models/person.js";
import User from "./models/user.js";

import personRouter from "./routes/person.js";
import authRouter from "./routes/auth.js";



const server = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const conString = "postgres://postgres:salam12345@localhost:5432/nodejstest";
const Store = postgresSessionStore(session);

server.use(express.urlencoded({ extended: true }));

server.use(async (req, res, next) => {req.user = await User.findByPk(1); next();});

// setting view engine and setting views directory
server.set("view engine", "ejs");
server.set("views", join(__dirname, "views"));

// setting static files directory which is ./public
server.use(express.static(join(__dirname, "public")));

// add session to route
server.use(session({secret: "This is super secret", resave: false, saveUninitialized: false, store: new Store({conString})}));

// routing
server.use(authRouter);
server.use(personRouter);

//Error handler middleware
server.use((error, req, res, next) => {
    console.log(error.message);
    res.render("404", {errorMessage: error.message ? error.message : "Forbidden Request!"});
})

Person.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Person);

// run the application,
async function runTheApp() {
    try {
        console.log("_____________________________\nChecking database\n_____________________________");
        await sequelizeInstance.authenticate();
        await sequelizeInstance.sync();
        const defaultUser = await User.findByPk(1);
        if (!defaultUser)
            await User.create({username: "navid", password: "complicated"});

        server.listen(8080, () => {
            console.log("_____________________________\nApp Start");
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

runTheApp();