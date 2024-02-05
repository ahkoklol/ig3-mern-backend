import { Router } from 'express';
import {  } from '../controllers/partController';
import { createPart, getAllPartsByPartNumber, getPartByRef, deletePartByRef, editPartByRef, getAllParts } from '../controllers/partController';

const router = Router();

router.post('/create', createPart);
router.get('/allparts', getAllParts);
router.get('/allparts/:part', getAllPartsByPartNumber);
router.get('/:ref', getPartByRef);
router.delete('/:ref', deletePartByRef);
router.put('/:ref', editPartByRef);

export default router;