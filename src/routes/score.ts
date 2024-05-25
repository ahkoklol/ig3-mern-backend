import { Router } from 'express';
import { createScore, updateScore, getScoresByStudent, getScore, deleteScore } from '../controllers/scoreController';
import { requireAuth } from '../middleware/requireAuth'

const router = Router();
router.use(requireAuth);

router.post('/create', createScore);
router.get('/all/:studentId', getScoresByStudent);
router.put('/:id', updateScore);
router.get('/:id', getScore);
router.delete('/:id', deleteScore);

export default router;