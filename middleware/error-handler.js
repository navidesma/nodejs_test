export default function errorHandler (error, req, res, next) {
    if (!error.type) {
        error.type = "critical";
    }
    console.log(error.type);
    console.log(error.message);
    if (error) {
        if (error.type === "user")
            res.status(404).render("404", {errorMessage: error.message ? error.message : "Bad Request!"});

        else {
            logger.error("Error: " + error.message);
            res.status(500).render("404", {errorMessage: "Something Went Wrong"});
        }
    }
}