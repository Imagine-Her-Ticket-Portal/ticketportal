import { Router } from "express";
import { handleUserLogin, handleUserSignup, softDeleteUser, handleRefreshToken } from "../controllers/users";
import { handleAdminLogin, handleAdminSignup, softDeleteAdmin } from "../controllers/admins";
import { authenticateJWT } from "../middlewares/authJWT";
import { getUser } from "../controllers/tickets";
import { validateStats } from "../middlewares/authStats";
import updateProfile from "../controllers/update";

const AuthRouter = Router();

AuthRouter.post("/signup", (req, res) => {
  const { role } = req.query;

  if (role === "user") handleUserSignup(req, res);
  else if (role === "admin") handleAdminSignup(req, res);
  else res.status(404).json({ message: "Role is not defined" });
});

AuthRouter.post("/login", (req, res) => {
  const { role } = req.query;

  if (role === "user") handleUserLogin(req, res);
  else if (role === "admin") handleAdminLogin(req, res);
  else res.status(404).json({ message: "Role is not defined" });
});

AuthRouter.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }
  
  try {
    await handleRefreshToken(req, res); // Call the refresh token handler
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error });
  }
});


AuthRouter.get("/me", authenticateJWT, getUser);

AuthRouter.post("/profile-update", authenticateJWT, validateStats, updateProfile);

// Soft delete a user
AuthRouter.patch('/user/:id/soft-delete', softDeleteUser);

// Soft delete an admin
AuthRouter.patch('/admin/:id/soft-delete', softDeleteAdmin);

export default AuthRouter;
