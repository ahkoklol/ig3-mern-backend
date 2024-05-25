import { Router } from 'express';
import {  } from '../controllers/partController';
import { createPart, getAllPartsByPartNumber, getPartByRef, deletePartByRef, editPartByRef, getAllParts } from '../controllers/partController';
import { requireAuth } from '../middleware/requireAuth'

const router = Router();
router.use(requireAuth);

router.post('/create', createPart);
router.get('/allparts', getAllParts);
router.get('/allparts/:part', getAllPartsByPartNumber);
router.get('/:ref', getPartByRef);
router.delete('/:ref', deletePartByRef);
router.put('/:ref', editPartByRef);

export default router;