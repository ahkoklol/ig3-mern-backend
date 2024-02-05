import Part from '../models/partModel'; // Adjust the path as necessary
import Question from '../models/questionModel'; // Adjust the path as necessary
import { Request, Response } from 'express';

// Controller to create a part
export const createPart = async (req: Request, res: Response) => {
    try {
        const { category, part, ref, time } = req.body;

        // First, find questions with the same ref to ensure they exist
        const questions = await Question.find({ ref });

        // Log found questions for debugging
        console.log(questions);

        // If questions exist, proceed to create the new part
        const newPart = await Part.create({
            category,
            part,
            ref,
            time,
            questions: questions.map(q => q._id) // Map to their _id values
        });

        // Since the questions are being set upon creation, no need for a separate save unless other operations are performed
        res.status(201).json(newPart);
    } catch (error) {
        console.error(error); // Log full error for debugging
        res.status(400).json({ message: error });
    }
};

// Controller to get a part by its ref
export const getPartByRef = async (req: Request, res: Response) => {
    try {
        const { ref } = req.params;
        const part = await Part.findOne({ ref }).populate('questions');
        if (!part) return res.status(404).json({ message: 'Part not found' });
        res.json(part);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Controller to delete a part by its ref
export const deletePartByRef = async (req: Request, res: Response) => {
    try {
        const { ref } = req.params; // Get ref from request parameters
        const part = await Part.findOneAndDelete({ ref }); // Find by ref and delete
        if (!part) return res.status(404).json({ message: 'Part not found' });
        res.json({ message: 'Part deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Controller to edit a part by its ref
export const editPartByRef = async (req: Request, res: Response) => {
    try {
        const { ref } = req.params; // Use ref to find the document
        const { category, part, time } = req.body; // Extract the fields you want to update from the request body

        // Find the part by its ref and update the specified fields without changing the ref
        const updatedPart = await Part.findOneAndUpdate({ ref }, { category, part, time }, { new: true });

        if (!updatedPart) {
            return res.status(404).json({ message: 'Part not found' });
        }

        res.json(updatedPart);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

// Controller to get all practices of a specific part
export const getAllPartsByPartNumber = async (req: Request, res: Response) => {
    try {
        // Extract the part number from the request. This could be through query params or URL params.
        const { part } = req.params;

        // Find parts that have the specified part number
        const parts = await Part.find({ part })

        if (parts.length === 0) {
            return res.status(404).json({ message: 'No parts found with the specified part name' });
        }

        res.json(parts);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Controller to get all parts
export const getAllParts = async (req: Request, res: Response) => {
    try {
        const parts = await Part.find().populate('questions'); // Populates the questions for each part
        res.json(parts); // Sends the array of parts as the response
    } catch (error) {
        console.error(error); // Log full error for debugging
        res.status(500).json({ message: error });
    }
};