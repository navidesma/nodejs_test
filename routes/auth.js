import {Router} from "express";
import getSignUp, {getLogout, getSignIn, postSignIn, postSignUp} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/signup", postSignUp);
authRouter.get("/signup", getSignUp);

authRouter.get("/signin", getSignIn);
authRouter.post("/signin", postSignIn);

authRouter.get("/logout", getLogout);


export default authRouter;