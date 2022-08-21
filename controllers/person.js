import Adam from "../models/adam.js";
import validator from "../util/validator.js";

const ID_PATTERN = /^\d+$/g;
const NAME_PATTERN = /^[a-zA-Z]+$/g;
const AGE_PATTERN = /^[1-9]\d?$/g;
const GENDER_PATTERN = /^(male||female)$/g;

export async function createPerson(req, res, next) {
    try {
        const validationResult = validator(req, ["name", NAME_PATTERN, "age", AGE_PATTERN, "gender", GENDER_PATTERN]);
        if (validationResult !== true)
            throw new Error(validationResult);

        const {name, age, gender} = req.body;
        const personDoesAlreadyExist = await req.user.hasAdam({where: {name}});

        if (!personDoesAlreadyExist)
            await req.user.createAdam({name, age, gender});

        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export async function deletePerson(req, res, next) {
    try {
        const validationResult = validator(req, ["id", ID_PATTERN], true);
        if (validationResult !== true)
            throw new Error(validationResult);

        const id = req.params.id;
        const person = await Adam.findByPk(id);
        if (!person)
            throw new Error("This person doesn't exist");
        if (person.UserId !== req.user.id)
            throw new Error(`This person doesn't belong to ${req.user.username}, Forbidden Request!`);


        await person.destroy();
        res.redirect("/");
    } catch (error) {
        next(error);
    }
}
export async function getPersonForEdit(req, res, next) {
    try {
        const validationResult = validator(req, ["id", ID_PATTERN], true);
        if (validationResult !== true)
            throw new Error(validationResult);

        const id = req.params.id;
        const person = await Adam.findByPk(id);
        if (!person)
            throw new Error("This person doesn't exist");
        if (person.UserId !== req.user.id)
            throw new Error(`This person doesn't belong to ${req.user.username}, Forbidden Request!`);
        const {name, age, gender} = person;
        res.render("edit-person", {name, age, gender, id});
    } catch (error) {
        next(error);
    }
}
export async function editPerson(req, res, next) {
    try {
        const validationResult1 = validator(req, ["name", NAME_PATTERN, "age", AGE_PATTERN, "gender", GENDER_PATTERN]);
        if (validationResult1 !== true)
            throw new Error(validationResult1);

        const validationResult2 = validator(req, ["id", ID_PATTERN], true);
        if (validationResult2 !== true)
            throw new Error(validationResult2);

        const {id} = req.params;
        const {name, age, gender} = req.body;


        const person = await Adam.findByPk(id);
        if (!person)
            throw new Error("This person doesn't exist");
        if (person.UserId !== req.user.id)
            throw new Error(`This person doesn't belong to ${req.user.username}, Forbidden Request!`);

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