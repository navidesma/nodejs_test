import Person from "../models/person.js";

async function createAPerson() {
    try {
        const result = await Person.create({
            name: "navid",
            age: 22,
            gender: "male"
        });
        console.log(result)
    } catch (error) {
        console.log(error)
    }

}

export default createAPerson;