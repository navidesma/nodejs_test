import Adam from "../models/adam.js";
import validator from "../util/validator.js";

import deleteFile from "../util/delete-file.js";

const ID_PATTERN = /^\d+$/g;
const NAME_PATTERN = /^[a-zA-Z]+$/g;
const AGE_PATTERN = /^[1-9]\d?$/g;
const GENDER_PATTERN = /^(male||female)$/g;

export async function createPerson(req, res, next) {
    try {
        if (!req.file) {
            const error = new Error("No File Is Provided");
            error.type = "user";
            throw error;
        }
        const validationResult = validator(req, ["name", NAME_PATTERN, "age", AGE_PATTERN, "gender", GENDER_PATTERN]);
        if (validationResult !== true) {
            await deleteFile(req.file.path);
            const error = new Error(validationResult + ", Deleted Uploaded File Successfully.");
            error.type = "user";
            throw error;
        }

        const {name, age, gender} = req.body;
        const imageUrl = req.file.path;

        const personDoesAlreadyExist = await Adam.findOne({where: {name, UserId: req.user.id}});
        if (!personDoesAlreadyExist)
            await req.user.createAdam({name, age, gender, imageUrl});
        else 
            await deleteFile(req.file.path);

        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export async function deletePerson(req, res, next) {
    try {
        const validationResult = validator(req, ["id", ID_PATTERN], true);
        if (validationResult !== true) {
            const error = new Error(validationResult);
            error.type = "user";
            throw error;
        }

        const id = req.params.id;
        const person = await Adam.findByPk(id);
        if (!person) {
            const error = new Error("This Person Doesn't Exist");
            error.type = "user";
            throw error;
        }
        if (person.UserId !== req.user.id) {
            const error = new Error(`This person doesn't belong to ${req.user.username}, Forbidden Request!`);
            error.type = "user";
            throw error;
        }
        await deleteFile(person.imageUrl);

        await person.destroy();
        res.redirect("/");
    } catch (error) {
        next(error);
    }
}
export async function getPersonForEdit(req, res, next) {
    try {
        const validationResult = validator(req, ["id", ID_PATTERN], true);
        if (validationResult !== true)  {
            const error = new Error(`This person doesn't belong to ${req.user.username}, Forbidden Request!`);
            error.type = "user";
            throw error;
        }

        const id = req.params.id;
        const person = await Adam.findByPk(id);
        if (!person) {
            const error = new Error("This Person Doesn't Exist");
            error.type = "user";
            throw error;
        }
        if (person.UserId !== req.user.id) {
            const error = new Error(`This person doesn't belong to ${req.user.username}, Forbidden Request!`);
            error.type = "user";
            throw error;
        }
        
        const {name, age, gender} = person;
        res.render("edit-person", {name, age, gender, id});
    } catch (error) {
        next(error);
    }
}
export async function editPerson(req, res, next) {
    try {
        const validationResult1 = validator(req, ["name", NAME_PATTERN, "age", AGE_PATTERN, "gender", GENDER_PATTERN]);
        if (validationResult1 !== true) {
            const error = new Error(validationResult1);
            error.type = "user";
            throw error;
        }

        const validationResult2 = validator(req, ["id", ID_PATTERN], true);
        if (validationResult2 !== true) {
            const error = new Error(validationResult2);
            error.type = "user";
            throw error;
        }

        const {id} = req.params;
        const {name, age, gender} = req.body;


        const person = await Adam.findByPk(id);
        if (!person) {
            const error = new Error("This Person Doesn't Exist");
            error.type = "user";
            throw error;
        }
        if (person.UserId !== req.user.id) {
            const error = new Error(`This person doesn't belong to ${req.user.username}, Forbidden Request!`);
            error.type = "user";
            throw error;
        }

        person.name = name;
        person.age = age;
        person.gender = gender;
        await person.save();
        res.redirect("/index");
    } catch (error) {
        next(error);
    }
}

export async function getAllPersons(req, res, next) {
    try {
        const persons = await req.user.getAdams({where: {"UserId": req.user.id}});
        persons.length > 0 ? res.render("index", {persons}) : res.render("index", {persons: false});
    } catch (error) {
        next(error);
    }
}