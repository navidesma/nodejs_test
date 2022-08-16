import Person from "../models/person.js";
import User from "../models/user.js";

const ID_PATTERN = /^\d+$/g;
const NAME_PATTERN = /^[a-zA-Z]+$/g;
const AGE_PATTERN = /^[1-9]\d?$/g;
const GENDER_PATTERN = /^(male||female)$/g;

export async function createPerson(req, res, next) {
    try {
        if (!req.body.name || !req.body.age || !req.body.gender)
            throw new Error("Invalid data");

        const {name, age, gender} = req.body;
        if (!(name.match(NAME_PATTERN) && age.match(AGE_PATTERN) && gender.match(GENDER_PATTERN)))
            throw new Error("invalid data");

        const personDoesAlreadyExist = await req.user.getPeople({where: {name: name}});
    console.log("__________create_person________\n" + personDoesAlreadyExist);
        if (!personDoesAlreadyExist)
            await req.user.createPeople({name, age, gender});

        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export async function deletePerson(req, res, next) {
    try {
        if (!req.params.id || !req.params.id.match(ID_PATTERN))
            throw new Error("Invalid data");

        const id = req.params.id;
        const person = await Person.findByPk(id);
        if (!person)
            throw new Error("This person doesn't exist");

        await person.destroy();
        res.redirect("/");
    } catch (error) {
        next(error);
    }
}
export async function getPersonForEdit(req, res, next) {
    try {
        if (!req.params.id.match(ID_PATTERN))
            throw new Error("Invalid ID");

        const id = req.params.id;
        const person = await Person.findByPk(id);
        const {name, age, gender} = person;
        res.render("edit-person", {name, age, gender, id});
    } catch (error) {
        next(error);
    }
}
export async function editPerson(req, res, next) {
    try {
        if (!req.params.id || !req.body.name || !req.body.age || !req.body.gender)
            throw new Error("invalid data");

        const {id} = req.params;
        const {name, age, gender} = req.body;

        if (!(id.match(ID_PATTERN) && name.match(NAME_PATTERN) && age.match(AGE_PATTERN) && gender.match(GENDER_PATTERN)))
            throw new Error("invalid data");

        const person = await Person.findByPk(id);
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
        const persons = await Person.findAll();
        persons.length > 0 ? res.render("index", {persons}) : res.render("index", {persons: false});
    } catch (error) {
        next(error);
    }
}