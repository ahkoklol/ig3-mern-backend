import { Router } from 'express';
import { createExam, getExamByExamNumber, deleteExamByExamNumber, updateExamTime, getAllExams } from '../controllers/examController';
import { requireAuth } from '../middleware/requireAuth'

const router = Router();
router.use(requireAuth);

router.post('/create', createExam);
router.get('/allexams', getAllExams);
router.get('/:examNumber', getExamByExamNumber);
router.delete('/:examNumber', deleteExamByExamNumber);
router.patch('/:examNumber', updateExamTime);

export default router;