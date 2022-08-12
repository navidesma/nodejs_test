import Person from "../models/person.js";

const DELETE_ID_PATTERN = /^\d{1,4}$/g;

export async function createPerson(req, res, next) {
    if (!req.body.name || !req.body.age || !req.body.gender) {
        next(new Error("Invalid data"));
        return;
    }
    const {name, age, gender} = req.body;
    try {
        const personDoesAlreadyExist = await Person.findOne({where: {name: name}});
        if (!personDoesAlreadyExist)
            await Person.create({name, age, gender});

        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export async function deletePerson(req, res, next) {
    if(!req.params.id) {
        next(new Error("Invalid data"));
        return;
    }
    const id = req.params.id;
    if (id.test(DELETE_ID_PATTERN))
    try {
        const personDoesAlreadyExist = await Person.findById();
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