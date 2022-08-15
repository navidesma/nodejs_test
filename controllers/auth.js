import User from "../models/user.js";

export async function postSignIn(req, res, next) {
    try {
        if (!req.body.username || !req.body.password)
            throw new Error("invalid data");

        const {username, password} = req.body;
        const user = await User.findOne({where: {username, password}});
        if (!user)
            throw new Error("user doesn't exist");

        req.session.isLoggedIn = true;
        req.session.user = user;
        await req.session.save();
        res.redirect("index");
    } catch (error) {
        next(error);
    }

}

export async function getSignIn(req, res, next) {
    res.render("signin");
}