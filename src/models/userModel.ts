import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

// Define an interface for the User document
interface UserDocument extends Document {
    email: string;
    password: string;
    name: string;
    surname: string;
    role: string;
    examsTaken: mongoose.Types.ObjectId[];
    progress: mongoose.Types.ObjectId[];
    teachingClasses: mongoose.Types.ObjectId[];
    assignedClasses: mongoose.Types.ObjectId[];
    dateJoined: Date;
}

// Define a Mongoose schema for the User model
const userSchema = new mongoose.Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    surname: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true 
    },
    examsTaken: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Exam' 
    }],
    progress: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'ProgressEntry' 
    }],
    teachingClasses: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Class' 
    }],
    assignedClasses: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Class' 
    }],
    dateJoined: { 
        type: Date, 
        default: Date.now 
    },
});

// Define the User model type
export interface UserModel extends Model<UserDocument> {
    signup(email: string, password: string, name: string, surname: string, role: string): Promise<UserDocument>;
}

// static signup method
userSchema.statics.signup = async function (email: string, password: string, name: string, surname: string, role: string) {
    
    // validation
    if(!email || !password) { // checks if email and password are provided
        throw new Error('Email and password are required');
    }
    if(!name || !surname) { // checks if name and surname are provided
        throw new Error('Name and surname are required');
    }
    if(!role) { // checks if role is provided
        throw new Error('Role is required');
    }
    if (!validator.isEmail(email)) { // checks if email is in email format
        throw new Error('Email is invalid');
    }
    if (!validator.isStrongPassword(password)) { // checks if password is strong
        throw new Error('Password is too weak');
    }
    
    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hashedPassword, name, surname, role });

    return user;
};

// Define the User model type
export interface UserModel extends Model<UserDocument> {
    login(email: string, password: string): Promise<UserDocument>;
}


// static login method
userSchema.statics.login = async function (email: string, password: string) {
    
    // validation
    if(!email || !password) { // checks if email and password are provided
        throw new Error('Email and password are required');
    }
    if (!validator.isEmail(email)) { // checks if email is in email format
        throw new Error('Email is invalid');
    }
    
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Email does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Password is incorrect');
    }

    return user;
};

// Create and export the User model
export const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);