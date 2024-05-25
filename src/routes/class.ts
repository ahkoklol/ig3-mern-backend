import { Router } from 'express';
import { getAllClasses, getStudentsFromClass, getStudentScores, createOrUpdateClassWithParticipants, getClass } from '../controllers/classController';
import { requireAuth } from '../middleware/requireAuth'

const router = Router();

router.use(requireAuth);

router.post('/create', createOrUpdateClassWithParticipants);

// Route to get all classes
router.get('/allclasses', getAllClasses);

// Route to get a class by ID
router.get('/:classId', getClass);

// Route to get all students from a class
router.get('/:classId/students', getStudentsFromClass);

// Route to get a student's scores
router.get('/:studentId/scores', getStudentScores);

export default router;