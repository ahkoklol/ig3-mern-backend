import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/userModel";

// Define a custom interface extending Request
export interface AuthRequest extends Request {
    user: {
        id: string;
    };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };

    req.user = await UserModel.findOne({ _id }).select('_id');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};