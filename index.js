import express from "express";
import sequelizeInstance from "./util/database.js";
import {join} from "path";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import csrf from "csurf";
import dotenv from "dotenv";
import multer, {diskStorage} from "multer";
import {v4 as uuidv4} from "uuid";

import Adam from "./models/adam.js";
import User from "./models/user.js";

import personRouter from "./routes/person.js";
import authRouter from "./routes/auth.js";
import addUserToReq from "./middleware/add-user-to-req.js";
import errorHandler from "./middleware/error-handler.js";

import {__dirname} from "./util/variables.js";
import logger from "./util/log-configuration.js";
import checkFileExistence from "./util/check-file-existance.js";
import NewError from "./util/NewError.js";

//____________________________________________________________________________________________________________________

// use .env
dotenv.config();
const {APPLICATION_PORT, DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT} = process.env;

const server = express();

// multer
const fileStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "_" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg")
        cb(null, true);
    else
        cb(null, false);
};

// session store
const Store = MySQLStore(session);
const STORE_OPTIONS = {
    host: DATABASE_HOST,
    port: DATABASE_PORT || 3306,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME
};
const sessionStore = new Store(STORE_OPTIONS);

const csrfProtection = csrf();


server.use(express.urlencoded({extended: true}));
server.use(multer({storage: fileStorage, fileFilter}).single("image"));


// setting view engine and setting views directory
server.set("view engine", "ejs");
server.set("views", join(__dirname, "views"));

// setting static files directory which is ./public
server.use(express.static(join(__dirname, "public")));

// add session to req
server.use(session({secret: "This is super secret", resave: false, saveUninitialized: false, store: sessionStore}));

// add csrfToken to req
server.use(csrfProtection);

// add variables to renders
server.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Auth routes
server.use(authRouter);

// Add user to req
server.use(addUserToReq);

// Get image route
server.get('/images/:imageFileName', async (req, res, next) => {
    try {
        if (req.params.imageFileName) {
            const person = await Adam.findOne({
                where: {
                    imageUrl: join("images", req.params.imageFileName),
                    UserId: req.user.id
                }
            });
            if (!person) {
                throw new NewError("You can't access this file", "user");
            }
            const filePath = join(__dirname, 'images', req.params.imageFileName);
            const doesFileExist = await checkFileExistence(filePath);
            if (!doesFileExist) {
                throw new NewError("File Doesn't Exist", "user");
            }
            res.sendFile(filePath);
        } else {
            throw new NewError("Wrong URL", "user");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

});
// main routes
server.use(personRouter);

//Error handler middleware
server.get("*", (req, res, next) => {
    res.status(404).render("404", {errorMessage: "Page Not Found"});
});
server.post("*", (req, res, next) => {
    res.status(404).render("404", {errorMessage: "Page Not Found"});
});
server.use(errorHandler);

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