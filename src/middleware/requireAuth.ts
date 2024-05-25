import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/userModel";

// Define a custom interface extending Request
export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        
        // Log the decoded token to ensure it contains the correct ID
        console.log('Decoded token:', decoded);

        // Find the user and attach it to the request object
        const user = await UserModel.findById(decoded.id).select('_id');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        req.user = { id: user._id.toString() };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
};