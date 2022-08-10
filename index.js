import express from "express";
import variables from "./util/variables.js";
import sequelize from "./util/database.js";
import person from "./controllers/person.js";

const server = express();

// setting view engine and setting views directory
server.set("view engine", "ejs");
server.set("views", variables.VIEWS_PATH);

// setting static files directory with is ./public
server.use(express.static(variables.PUBLIC_PATH));

// routing
server.get("/", async (req, res) => {
    await person();
    res.render("index");
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