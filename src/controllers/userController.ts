import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import jwt from 'jsonwebtoken'; // Import 'jsonwebtoken' with lowercase 'jwt'

const createToken = (id: string) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '3d' }); // Return the token
    return token;
}

// Login user
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user.id);
        res.status(200).json({ email, token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Signup user
export const signupUser = async (req: Request, res: Response) => {
    const { email, password, name, surname, role } = req.body;

    try {
        const user = await UserModel.signup(email, password, name, surname, role);
        const token = createToken(user.id);
        res.status(200).json({ email, token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};