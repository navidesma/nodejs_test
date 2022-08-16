import User from "../models/user.js";

const EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const PASSWORD_PATTERN = /^$/g;

export default function getSignUp(req, res, next) {
    try {
        res.render("signup");
    } catch (error) {
        next(error);
    }
}

export async function postSignUp(req, res, next) {
    try {
        if (!req.body.username || !req.body.password)
            throw new Error("invalid data");

        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        if (user)
            throw new Error("User already exists");

        await User.create({username, password});

        const newUser = await User.findOne({where: {username}});
        req.session.isLoggedIn = true;
        req.session.user = newUser;
        await req.session.save();
        res.redirect("/index");
    } catch (error) {
        next(error);
    }
}

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
        req.user = user;
        await req.session.save();
        res.redirect("index");
    } catch (error) {
        next(error);
    }

}

export async function getLogout(req, res, next) {
    try {
        req.session.destroy(err => {
            if (err)
                throw err;
            else
                res.redirect("signin");
        });
    } catch (error) {
        next(error);
    }
}

export async function getSignIn(req, res, next) {
    res.render("signin");
}