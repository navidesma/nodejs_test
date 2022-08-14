import { Router } from "express";
import {createPerson, deletePerson, editPerson, getAllPersons, getPersonForEdit} from "../controllers/person.js";

const personRouter = Router();

personRouter.get("", getAllPersons);
personRouter.get("/", getAllPersons);
personRouter.get("/index", getAllPersons);

personRouter.post("/addNewPerson", createPerson);

personRouter.get("/removePerson/:id", deletePerson);

personRouter.get("/edit-person/:id", getPersonForEdit);
personRouter.post("/editPerson/:id", editPerson);


export default personRouter;