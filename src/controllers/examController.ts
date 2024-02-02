import Exam from '../models/examModel'; // Adjust the path as necessary
import Question from '../models/questionModel'; // Adjust the path as necessary
import { Request, Response } from 'express';

// Controller to create an exam (more like put the questions together)
export const createExam = async (req: Request, res: Response) => {
  try {
    const { examNumber, time } = req.body;

    // Create the exam
    const exam = new Exam({
      examNumber,
      time,
    });

    // Save the exam to get its ID
    await exam.save();

    // Find questions with the matching examNumber
    const questions = await Question.find({ examNumber: examNumber });

    // Link questions to the exam
    exam.questions = questions.map(q => q._id);
    await exam.save();

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Failed to create exam', error: error });
  }
};

// Controller to get an exam by its examNumber
export const getExamByExamNumber = async (req: Request, res: Response) => {
    try {
      const { examNumber } = req.params; // Assuming examNumber is passed as a URL parameter
      const exam = await Exam.findOne({ examNumber: parseInt(examNumber, 10) });
  
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
  
      res.status(200).json(exam);
    } catch (error) {
      console.error('Error fetching exam:', error);
      res.status(500).json({ message: 'Error fetching exam', error });
    }
  };

// Controller to delete an exam by its examNumber
export const deleteExamByExamNumber = async (req: Request, res: Response) => {
    try {
      const { examNumber } = req.params; // Assuming examNumber is passed as a URL parameter
      const deletedExam = await Exam.findOneAndDelete({ examNumber: parseInt(examNumber, 10) });
  
      if (!deletedExam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
  
      res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
      console.error('Error deleting exam:', error);
      res.status(500).json({ message: 'Error deleting exam', error });
    }
  };

  // Controller to patch the exam's time
  export const updateExamTime = async (req: Request, res: Response) => {
    try {
        const { examNumber } = req.params; // Assuming examNumber is passed as a URL parameter
        const { time } = req.body; // New time to update

        const updatedExam = await Exam.findOneAndUpdate(
            { examNumber: parseInt(examNumber, 10) },
            { time: time },
            { new: true } // Returns the updated document
        );

        if (!updatedExam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.status(200).json({ message: 'Exam time updated successfully', updatedExam });
    } catch (error) {
        console.error('Error updating exam time:', error);
        res.status(500).json({ message: 'Error updating exam time', error });
    }
};

// Controller to get all exams
export const getAllExams = async (req: Request, res: Response) => {
    try {
        const exams = await Exam.find({});
        res.status(200).json(exams);
    } catch (error) {
        console.error('Error fetching all exams:', error);
        res.status(500).json({ message: 'Error fetching exams', error });
    }
};