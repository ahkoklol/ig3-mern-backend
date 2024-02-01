import { Router } from "express";
const router = Router();

// Import the controller functions
import { signupUser, loginUser, profileUser } from "../controllers/userController";

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/signup", signupUser);

// Profile route
router.get("/profile/:userId", profileUser);

export default router;