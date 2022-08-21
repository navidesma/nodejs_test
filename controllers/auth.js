import User from "../models/user.js";
import validator from "../util/validator.js";

// const EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const NAME_PATTERN = /^[a-zA-Z]+$/g;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

export default function getSignUp(req, res, next) {
    try {
        res.render("signup");
    } catch (error) {
        next(error);
    }
}

export async function postSignUp(req, res, next) {
    try {
        const validationResult = validator(req, ["username", NAME_PATTERN, "password", PASSWORD_PATTERN]);
        if (validationResult !== true)
            throw new Error(validationResult);

        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        if (user)
            throw new Error("User already exists");

        await User.create({username, password});

        const newUser = await User.findOne({where: {username}});
        req.session.isLoggedIn = true;
        req.session.user = newUser;
        req.user = newUser;
        await req.session.save();
        res.redirect("/index");
    } catch (error) {
        next(error);
    }
}

export async function postSignIn(req, res, next) {
    try {
        const validationResult = validator(req, ["username", NAME_PATTERN, "password", PASSWORD_PATTERN]);
        if (validationResult !== true)
            throw new Error(validationResult);

        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        if (!user)
            throw new Error("user doesn't exist");
        if (user.password !== password)
            throw new Error("Wrong password");

        req.session.isLoggedIn = true;
        req.session.user = user;
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
    try {
        res.render("signin");
    } catch (error) {
        next(error);
    }
}