import { Router } from 'express';
import multer from 'multer';
import { createQuestion, editQuestion, getQuestion, deleteQuestion, getRandomQuestion, getAllQuestions } from '../controllers/questionController';

const router = Router();

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Ensure this uploads directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const upload = multer({ storage });

router.post('/create', upload.fields([{ name: 'imagePath', maxCount: 1 }, { name: 'audioPath', maxCount: 1 }]), createQuestion);
router.get('/random', getRandomQuestion);
router.get('/allquestions', getAllQuestions);
router.put('/edit/:questionId', editQuestion);
router.get('/:questionId', getQuestion);
router.delete('/:questionId', deleteQuestion);

export default router;