import { Request, Response } from 'express';
import Question from '../models/questionModel'; // Assuming your Question model is exported with default

// Controller to handle creating a new question
export const createQuestion = async (req: Request, res: Response) => {
  try {
    // Create a new question using the data from the request body
    const newQuestion = new Question({
      text: req.body.text,
      choices: req.body.choices,
      correctAnswer: req.body.correctAnswer,
      teacherCorrection: req.body.teacherCorrection || null,
    });

    // Save the new question to the database
    const savedQuestion = await newQuestion.save();

    // Send back the newly created question
    res.status(201).json(savedQuestion);
  } catch (error) {
    // If there's an error, send back a 500 server error response
    res.status(500).json({ message: 'Error creating new question', error });
  }
};

// Controller to edit an existing question
export const editQuestion = async (req: Request, res: Response) => {
    const { questionId } = req.params; // Assuming the ID is passed as a URL parameter
    const { text, choices, correctAnswer, teacherCorrection } = req.body;
  
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        {
          $set: {
            text,
            choices,
            correctAnswer,
            teacherCorrection
          },
        },
        {
          new: true, // Return the modified document rather than the original
          runValidators: true, // Ensure the update honors schema validation
        }
      );
  
      if (!updatedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      // Send back the updated question
      res.status(200).json(updatedQuestion);
    } catch (error) {
      // If there's an error, send back a 500 server error response
      res.status(500).json({ message: 'Error updating question', error });
    }
  };

  // Controller to get a specific question by ID
export const getQuestion = async (req: Request, res: Response) => {
    const { questionId } = req.params; // Extract the question ID from URL parameters
  
    try {
      const question = await Question.findById(questionId);
  
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      // Send back the found question
      res.status(200).json(question);
    } catch (error) {
      // If there's an error, such as an invalid question ID format, send back a 500 server error response
      res.status(500).json({ message: 'Error fetching question', error });
    }
  };

  // Controller to delete a specific question by ID
export const deleteQuestion = async (req: Request, res: Response) => {
    const { questionId } = req.params; // Extract the question ID from URL parameters
  
    try {
      const deletedQuestion = await Question.findByIdAndDelete(questionId);
  
      if (!deletedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      // Send back a confirmation that the question was deleted
      res.status(200).json({ message: 'Question successfully deleted', deletedQuestionId: questionId });
    } catch (error) {
      // If there's an error, such as an invalid question ID format, send back a 500 server error response
      res.status(500).json({ message: 'Error deleting question', error });
    }
  };

// Controller to get a random question from the database (for quickfire)
export const getRandomQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const randomQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);
  
      if (randomQuestion.length === 0) {
        res.status(404).json({ message: 'No questions found' });
        return;
      }
  
      res.status(200).json(randomQuestion[0]); // $sample returns an array
    } catch (error) {
      res.status(500).json({ message: 'Error fetching random question', error });
    }
  };

// Controller to get all questions available in the database
export const getAllQuestions = async (req: Request, res: Response) => {
    try {
      // Retrieve all questions from the database
      const questions = await Question.find({});
      // Send back the list of questions
      res.status(200).json(questions);
    } catch (error) {
      // If there's an error, send back a 500 server error response
      res.status(500).json({ message: 'Error fetching questions', error });
    }
  };