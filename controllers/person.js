import Adam from "../models/adam.js";
import validator from "../util/validator.js";

import deleteFile from "../util/delete-file.js";
import NewError from "../util/NewError.js";

const ID_PATTERN = /^\d+$/g;
const NAME_PATTERN = /^[a-zA-Z]+$/g;
const AGE_PATTERN = /^[1-9]\d?$/g;
const GENDER_PATTERN = /^(male||female)$/g;

export async function createPerson(req, res, next) {
    try {
        if (!req.file) {
            throw new NewError("No File Is Provided", "user");
        }
        const validationResult = validator(req, ["name", NAME_PATTERN, "age", AGE_PATTERN, "gender", GENDER_PATTERN]);
        if (validationResult !== true) {
            await deleteFile(req.file.path);
            throw new NewError(validationResult + ", Deleted Uploaded File Successfully.", "user");
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
            throw new NewError(validationResult);
        }

        const id = req.params.id;
        const person = await Adam.findByPk(id);
        if (!person) {
            throw new NewError("This Person Doesn't Exist", "user");
        }
        if (person.UserId !== req.user.id) {
            throw new NewError(`This person doesn't belong to ${req.user.username}, Forbidden Request!`, "user");
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
            throw new NewError(`This person doesn't belong to ${req.user.username}, Forbidden Request!`, "user");
        }

        const id = req.params.id;
        const person = await Adam.findByPk(id);
        if (!person) {
            throw new NewError("This Person Doesn't Exist", "user");
        }
        if (person.UserId !== req.user.id) {
            throw new NewError(`This person doesn't belong to ${req.user.username}, Forbidden Request!`, "user");
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
            throw new NewError(validationResult1, "user");
        }

        const validationResult2 = validator(req, ["id", ID_PATTERN], true);
        if (validationResult2 !== true) {
            throw new NewError(validationResult2, "user");
        }

        const {id} = req.params;
        const {name, age, gender} = req.body;


        const person = await Adam.findByPk(id);
        if (!person) {
            throw new NewError("This Person Doesn't Exist", "user");
        }
        if (person.UserId !== req.user.id) {
            throw new NewError(`This person doesn't belong to ${req.user.username}, Forbidden Request!`, "user");
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