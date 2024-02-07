import { Request, Response } from 'express';
import ClassModel from '../models/classModel';
import { UserModel } from '../models/userModel';
import ScoreModel from '../models/scoreModel';
import mongoose from 'mongoose';

// Controller to get all classes
export const getAllClasses = async (req: Request, res: Response): Promise<void> => {
    try {
        const classes = await ClassModel.find({});
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes', error });
    }
};

// Controller to get all students from a class
export const getStudentsFromClass = async (req: Request, res: Response): Promise<void> => {
    const { classId } = req.params;

    try {
        const classObj = await ClassModel.findById(classId);

        // If classObj is null, no class was found
        if (!classObj) {
            res.status(404).json({ message: 'Class not found' }); // Removed return statement
            return; // Just return here to prevent further execution
        }

        // Use the students array from the found class to query for student documents
        const students = await UserModel.find({
            '_id': { $in: classObj.students }
        });

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};

// Controller to get a student's scores by their ID
export const getStudentScores = async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.params;

    try {
        const scores = await ScoreModel.find({ student: studentId });
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student scores', error });
    }
};

// Controller to create a class and link students and teacher
export const createOrUpdateClassWithParticipants = async (req: Request, res: Response): Promise<void> => {
    const { className, teacherEmail } = req.body;

    try {
        // Find or create the class with the given name
        let classroom = await ClassModel.findOneAndUpdate(
            { name: className },
            {},
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Find all students with the specified class name and link them to the class
        const students = await UserModel.find({ class: className, role: 'student' });
        const studentIds = students.map(student => student._id);
        classroom.students = studentIds; // Correctly link students to the class
        await classroom.save();

        // Find the teacher by email and link them to the class
        const teacher = await UserModel.findOne({ email: teacherEmail, role: 'teacher' });
        if (teacher) {
            classroom.teacher = teacher._id;
            await classroom.save();
        } else {
            throw new Error('Teacher not found');
        }

        res.status(200).json({ message: 'Class and participants linked successfully', classroom });
    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating class with participants', error });
    }
};

// Controller to get a class by its id
export const getClass = async (req: Request, res: Response): Promise<void> => {
    const { classId } = req.params;

    try {
        const classroom = await ClassModel.findById(classId);
        if (!classroom) {
            res.status(404).json({ message: 'Class not found' });
            return;
        }
        res.status(200).json(classroom);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching class', error });
    }
};
