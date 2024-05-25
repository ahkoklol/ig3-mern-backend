import { Router } from "express";
const router = Router();

// Import the controller functions
import { signupUser, loginUser, profileUser, editUser, getAllUsers } from "../controllers/userController";
import { requireAuth } from '../middleware/requireAuth'

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/signup", signupUser);

router.use(requireAuth);

router.get('/allusers', getAllUsers);

// Profile route
router.get("/profile/:userId", profileUser);

router.put('/:userId', editUser);

export default router;