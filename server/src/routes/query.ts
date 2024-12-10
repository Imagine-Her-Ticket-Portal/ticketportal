import { Router } from "express";
import { handleForgotPassword, setNewPassword } from "../controllers/forgot";
import { authenticateJWT } from "../middlewares/authJWT";

const queryRouter = Router();

queryRouter.post("/forgot-password", handleForgotPassword);

queryRouter.post("/set-password", authenticateJWT, setNewPassword);

export default queryRouter;
