import {Router} from "express";
import {getSignIn, postSignIn} from "../controllers/auth.js";

const authRouter = Router();

authRouter.get("/signin", getSignIn);

authRouter.post("/signin", postSignIn);


export default authRouter;