import { Router } from 'express';
import { createQuestion, editQuestion, getQuestion, deleteQuestion, getRandomQuestion, getAllQuestions } from '../controllers/questionController';

const router = Router();

// Route to create a new question
router.get('/random', getRandomQuestion);
router.post('/create', createQuestion);
router.get('/allquestions', getAllQuestions)
router.put('/edit/:questionId', editQuestion);
router.get('/:questionId', getQuestion);
router.delete('/:questionId', deleteQuestion);

export default router;