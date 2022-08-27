import User from "../models/user.js";

export default async function addUserToReq (req, res, next) {
    try {
        if (!req.session.user) {
            res.redirect("signin");
            return;
        }
        const user = await User.findByPk(req.session.user.id);
        if (!user)
            throw new Error("Session Expired, Or Database Has Exploded");
        req.user = user;
        next();
    } catch (error) {
        if (req.session.isLoggedIn) {
            req.session.destroy(err => {
                if (err)
                    error = err;
            });
        }
        res.render("404", {errorMessage: error});
    }
}