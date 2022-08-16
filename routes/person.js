import { Router } from "express";
import {createPerson, deletePerson, editPerson, getAllPersons, getPersonForEdit} from "../controllers/person.js";
import {isAuthenticated} from "../middleware/is-auth.js";

const personRouter = Router();

personRouter.get("", isAuthenticated, getAllPersons);
personRouter.get("/", isAuthenticated, getAllPersons);
personRouter.get("/index", isAuthenticated, getAllPersons);

personRouter.post("/addNewPerson", isAuthenticated, createPerson);

personRouter.get("/removePerson/:id", isAuthenticated, deletePerson);

personRouter.get("/edit-person/:id", isAuthenticated, getPersonForEdit);
personRouter.post("/editPerson/:id", isAuthenticated, editPerson);


export default personRouter;