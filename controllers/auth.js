import User from "../models/user.js";
import validator from "../util/validator.js";
import {hash, compare} from "bcrypt";

// const EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
// const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
const NAME_PATTERN = /^[a-zA-Z]+$/g;
const PASSWORD_PATTERN = /^([\d\w]){2,}$/g;

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
        if (validationResult !== true) {
            const error = new Error(validationResult);
            error.type = "user";
            throw error;
        }

        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        if (user) {
            const error = new Error("User Already Exists.");
            error.type = "user";
            throw error;
        }
        const hashedPassword = await hash(password, 12);
        await User.create({username, password: hashedPassword});

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
        if (validationResult !== true) {
            const error = new Error(validationResult);
            error.type = "user";
            throw error;
        }

        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        if (!user) {
            const error = new Error("User Doesn't Exist");
            error.type = "user";
            throw error;
        }
        const isEqual = await compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong Password");
            error.type = "user";
            throw error;
        }

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