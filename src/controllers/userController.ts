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
        res.status(200).json({ email, token, _id: user._id });
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
        res.status(200).json({ email, token, _id: user._id });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


// Fetch and return the user's profile
export const profileUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
  
    try {
      // Fetch the user's profile based on their ID
      const user = await UserModel.findById({_id: userId});
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Extract relevant profile information
      const profile = {
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
        class: user.class,
        examsTaken: user.examsTaken,
        teachingClasses: user.teachingClasses,
        dateJoined: user.dateJoined,
      };
  
      res.status(200).json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };

// Controller to edit a user
export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params; // Extract the user's ID from the URL parameters
  const updateData = req.body; // Data for updating the user

  try {
      // Assuming userId is a valid MongoDB ObjectId and updateData contains the fields you want to update
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
          new: true, // Return the updated user document
          runValidators: true // Run schema validators on the update
      });

      if (!updatedUser) {
          res.status(404).json({ message: 'User not found' });
          return;
      }

      res.status(200).json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
  }
};