import User from "../models/user.js";
import NewError from "../util/NewError.js";

export default async function addUserToReq (req, res, next) {
    try {
        if (!req.session.user) {
            res.redirect("signin");
            return;
        }
        const user = await User.findByPk(req.session.user.id);
        if (!user)
            throw new NewError("Session Expired, Or Database Has Exploded", "user");
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