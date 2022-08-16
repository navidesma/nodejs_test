import express from "express";
import sequelizeInstance from "./util/database.js";
import {join} from "path";
import * as url from "url";
import session from "express-session";
import MySQLStore from "express-mysql-session";

import Person from "./models/person.js";
import User from "./models/user.js";

import personRouter from "./routes/person.js";
import authRouter from "./routes/auth.js";



const server = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const Store = MySQLStore(session);
const STORE_OPTIONS = {host: 'localhost', port: 3306, user: 'root', password: 'salam12345', database: 'fornode'};
const sessionStore = new Store(STORE_OPTIONS);

server.use(express.urlencoded({ extended: true }));

server.use(async (req, res, next) => {req.user = await User.findByPk(1); next();});

// setting view engine and setting views directory
server.set("view engine", "ejs");
server.set("views", join(__dirname, "views"));

// setting static files directory which is ./public
server.use(express.static(join(__dirname, "public")));

// add session to route
server.use(session({secret: "This is super secret", resave: false, saveUninitialized: false, store: sessionStore}));

// routing
server.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});
server.use(authRouter);
server.use(personRouter);

//Error handler middleware
server.use((error, req, res, next) => {
    console.log(error.message);
    res.status(404).render("404", {errorMessage: error.message ? error.message : "Bad Request!"});
})

Person.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Person);

// run the application,
async function runTheApp() {
    try {
        console.log("_____________________________\nChecking database\n_____________________________");
        await sequelizeInstance.authenticate();
        await sequelizeInstance.sync();
        // await sequelizeInstance.sync({force: true});

        server.listen(8080, () => {
            console.log("_____________________________\nApp Start");
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

runTheApp();