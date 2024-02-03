import { Router } from 'express';
import {  } from '../controllers/partController';
import { createPart, getAllPartsByPartNumber, getPartByRef, deletePartByRef, editPartByRef } from '../controllers/partController';

const router = Router();

router.post('/create', createPart);
router.get('/:part', getAllPartsByPartNumber);
router.get('/:ref', getPartByRef);
router.delete('/:ref', deletePartByRef);
router.patch('/:ref', editPartByRef);

export default router;