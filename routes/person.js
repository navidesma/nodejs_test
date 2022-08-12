import { Router } from "express";
import {createPerson, deletePerson, getAllPersons} from "../controllers/person.js";

const personRouter = Router();

personRouter.get("", getAllPersons);
personRouter.get("/", getAllPersons);
personRouter.get("/index", getAllPersons);

personRouter.post("/addNewPerson", createPerson);

personRouter.post("/deletePerson/:id", deletePerson);


export default personRouter;