import Score from '../models/scoreModel'; // Adjust the path as necessary
import { Request, Response } from 'express';

// Controller to create/post a new score
export const createScore = async (req: Request, res: Response) => {
    const { examNumber, questions, score, student } = req.body;

    try {
        const newScore = await Score.create({
            examNumber,
            questions,
            score,
            date: new Date(), // Use the current date
            student
        });

        res.status(201).json(newScore);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

// Controller to update score information
export const updateScore = async (req: Request, res: Response) => {
    const { examNumber, questions, score, date, student } = req.body;

    try {
        const updatedScore = await Score.findByIdAndUpdate(req.params.id, {
            examNumber,
            questions,
            score,
            date,
            student
        }, { new: true }); // { new: true } option returns the document after update

        if (!updatedScore) return res.status(404).json({ message: 'Score not found' });

        res.json(updatedScore);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

// Controller to get all scores of a student
export const getScoresByStudent = async (req: Request, res: Response) => {
    try {
        const scores = await Score.find({ student: req.params.studentId }).populate('student');

        if (scores.length === 0) return res.status(404).json({ message: 'No scores found for this student' });

        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Controller to get a specific score
export const getScore = async (req: Request, res: Response) => {
    try {
        const score = await Score.findById(req.params.id).populate('student');
        if (!score) return res.status(404).json({ message: 'Score not found' });

        res.json(score);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Controller to delete a score by ID
export const deleteScore = async (req: Request, res: Response) => {
    try {
        const deletedScore = await Score.findByIdAndDelete(req.params.id);

        if (!deletedScore) return res.status(404).json({ message: 'Score not found' });

        // Respond with a message indicating successful deletion
        res.json({ message: 'Score successfully deleted', deletedScoreId: deletedScore._id });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};