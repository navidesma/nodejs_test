import express from "express";
import sequelizeInstance from "./util/database.js";
import {join} from "path";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import csrf from "csurf";
import dotenv from "dotenv";

import Adam from "./models/adam.js";
import User from "./models/user.js";

import personRouter from "./routes/person.js";
import authRouter from "./routes/auth.js";

import {__dirname} from "./util/variables.js";
import logger from "./util/log-configuration.js";

//____________________________________________________________________________________________________________________

// use .env
dotenv.config();
const {APPLICATION_PORT, DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT} = process.env;

const server = express();

// session store
const Store = MySQLStore(session);
const STORE_OPTIONS = {host: DATABASE_HOST, port: DATABASE_PORT || 3306, user: DATABASE_USER, password: DATABASE_PASSWORD, database: DATABASE_NAME};
const sessionStore = new Store(STORE_OPTIONS);

const csrfProtection = csrf();


server.use(express.urlencoded({extended: true}));


// setting view engine and setting views directory
server.set("view engine", "ejs");
server.set("views", join(__dirname, "views"));

// setting static files directory which is ./public
server.use(express.static(join(__dirname, "public")));

// add session to req
server.use(session({secret: "This is super secret", resave: false, saveUninitialized: false, store: sessionStore}));

// add csrfToken to req
server.use(csrfProtection);

// Add user to req
server.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    try {
        const user = await User.findByPk(req.session.user.id);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
})

// add variables to renders
server.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// routing
server.use(authRouter);
server.use(personRouter);

//Error handler middleware
server.use((error, req, res, next) => {
    if (!error.type) {
        error.type = "critical";
    }
    console.log(error.type);
    console.log(error.message);
    if (error) {
        if (error.type === "user")
            res.status(404).render("404", {errorMessage: error.message ? error.message : "Bad Request!"});

        else {
            logger.error("Unknown Error: " + error.message);
            res.status(500).render("404", {errorMessage: "Something Went Wrong"});
        }
    }
})

Adam.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Adam);

// run the application,
async function runTheApp() {
    try {
        console.log("_____________________________\nChecking database\n_____________________________");
        await sequelizeInstance.authenticate();
        await sequelizeInstance.sync();
        // await sequelizeInstance.sync({force: true});

        server.listen(APPLICATION_PORT, () => {
            console.log("_____________________________\nApp Start");
        });
    } catch (error) {
        // console.error('Unable to connect to the database:', error);
        logger.error('Unable to connect to the database:' + error);
    }
}

runTheApp();