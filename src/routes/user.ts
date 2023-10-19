import { Router } from "express";
const router = Router();

// Import the controller functions
import { signupUser, loginUser } from "../controllers/userController";

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/signup", signupUser);

export default router;