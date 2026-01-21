import express from 'express';
import { allowStudent, authenticate } from '../middlewares/auth.middleware';
import { saveAnswer, skipQuestion, startAttempt, submitAttempt } from '../controllers/quizAttempt.controller';

const router = express.Router();

router.post('/start',authenticate,allowStudent,startAttempt);
router.post('/save',authenticate,allowStudent,saveAnswer);
router.post('/skip',authenticate,allowStudent,skipQuestion);
router.post('/submit',authenticate,allowStudent,submitAttempt);


export default router;
