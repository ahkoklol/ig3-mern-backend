import { Router } from "express";
const router = Router();

// Import the controller functions
import { signupUser, loginUser, profileUser, editUser, getAllUsers } from "../controllers/userController";

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/signup", signupUser);

router.get('/allusers', getAllUsers);

// Profile route
router.get("/profile/:userId", profileUser);

router.put('/:userId', editUser);

export default router;