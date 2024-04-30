import { Request, Response } from 'express';
import Question from '../models/questionModel'; // Assuming your Question model is exported with default
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// Controller to handle creating a new question with file uploads
export const createQuestion = async (req: Request, res: Response) => {
  try {
    // Since we're using multer's fields, req.files will be an object with keys corresponding to the field names
    // We need to properly type cast req.files to inform TypeScript of the expected structure
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imagePath = files.imagePath ? files.imagePath[0].path : null;
    const audioPath = files.audioPath ? files.audioPath[0].path : null;

    // Create a new question using the data from the request body
    const newQuestion = new Question({
      text: req.body.text,
      choices: req.body.choices,
      correctAnswer: req.body.correctAnswer,
      teacherCorrection: req.body.teacherCorrection || null,
      examNumber: req.body.examNumber,
      category: req.body.category,
      part: req.body.part,
      ref: req.body.ref || null,
      imagePath: imagePath, // Will be null if no image was uploaded
      audioPath: audioPath, // Will be null if no audio was uploaded
    });

    // Save the new question to the database
    const savedQuestion = await newQuestion.save();

    // Send back the newly created question with file paths if applicable
    res.status(201).json(savedQuestion);
  } catch (error) {
    // If there's an error, send back a 500 server error response
    res.status(500).json({ message: 'Error creating new question', error });
  }
};

// Controller to edit an existing question
export const editQuestion = async (req: Request, res: Response) => {
    const { questionId } = req.params; // Assuming the ID is passed as a URL parameter
    const { text, choices, correctAnswer, teacherCorrection, examNumber, category, part, ref } = req.body;
  
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        {
          $set: {
            text,
            choices,
            correctAnswer,
            teacherCorrection,
            examNumber, 
            category,
            part,
            ref,
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

  export const createMultipleQuestions = async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File; // Type casting for multer file object
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Read and parse the JSON file
        const filePath = path.join(file.destination, file.filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const questionsData = JSON.parse(fileContent).questions;

        // Process each question
        const createdQuestions = await Promise.all(questionsData.map(async (questionData: {
            text: string;
            choices: string[];
            correctAnswer: string;
            teacherCorrection?: string;
            examNumber: string;
            category: string;
            part: string;
            ref?: string;
            imagePath?: string;
            audioPath?: string;
        }) => {
            const imagePath = questionData.imagePath ? path.join('path/to/images', questionData.imagePath) : null;
            const audioPath = questionData.audioPath ? path.join('path/to/audios', questionData.audioPath) : null;

            const newQuestion = new Question({
                ...questionData,
                imagePath: imagePath,
                audioPath: audioPath
            });

            return await newQuestion.save();
        }));

        // Clean up: Delete the temporary file
        fs.unlinkSync(filePath);

        // Send back the created questions
        res.status(201).json(createdQuestions);
    } catch (error) {
        // Handle JSON parsing errors or other exceptions
        res.status(500).json({ message: 'Error processing file', error });
    }
};


export const createMultipleQuestionsViaZip = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const filePath = path.join(file.destination, file.filename);
        const zip = new AdmZip(filePath);
        const extractPath = path.join(file.destination);
        
        // Extract the ZIP file to a specific directory
        zip.extractAllTo(extractPath, true);

        // Find the JSON file and parse it
        const jsonEntry = zip.getEntries().find(entry => entry.name.endsWith('.json'));
        if (!jsonEntry) {
            throw new Error('JSON file not found in the ZIP archive.');
        }

        const jsonDataPath = path.join(extractPath, jsonEntry.entryName);
        const jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));

        // Process each question
        const createdQuestions = await Promise.all(jsonData.questions.map(async (questionData: {
            text: string;
            choices: string[];
            correctAnswer: string;
            teacherCorrection?: string;
            examNumber: string;
            category: string;
            part: string;
            ref?: string;
            imagePath?: string;
            audioPath?: string;
        }) => {
            const imagePath = questionData.imagePath ? path.join(extractPath, questionData.imagePath) : null;
            const audioPath = questionData.audioPath ? path.join(extractPath, questionData.audioPath) : null;

            const imageExists = imagePath && fs.existsSync(imagePath);
            const audioExists = audioPath && fs.existsSync(audioPath);

            const newQuestion = new Question({
                ...questionData,
                imagePath: imageExists ? imagePath : 'Image not found',
                audioPath: audioExists ? audioPath : 'Audio not found'
            });

            return await newQuestion.save();
        }));

        // Clean up after processing
        fs.unlinkSync(filePath); // Delete the uploaded ZIP file
        fs.rmdirSync(extractPath, { recursive: true }); // Remove the extracted files directory

        // Return the created questions
        res.status(201).json(createdQuestions);
    } catch (error) {
        console.error('Failed to process ZIP file:', error);
        res.status(500).json({ message: 'Error processing file', error: error });
    }
};