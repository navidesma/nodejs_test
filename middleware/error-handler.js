import logger from "../util/log-configuration.js";

export default function errorHandler(error, req, res, next) {
    if (error) {
        if (!error.type)
            error.type = "critical";

        console.log(error.type);
        console.log(error.message);

        if (error.type === "user" || error.message.match(/^.*csrf.*$/g))
            res.status(400).render("404", {errorMessage: error.message && "Bad Request!"});

        else {
            logger.error("Error: " + error.message);
            res.status(500).render("404", {errorMessage: "Something Went Wrong"});
        }
    } else {
        res.status(500).render("404", {errorMessage: "Something Went Wrong"});
    }
}