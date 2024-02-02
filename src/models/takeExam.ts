import mongoose, { Document, Schema } from 'mongoose';

interface TakingExam extends Document {
    student: mongoose.Types.ObjectId;
    exam: mongoose.Types.ObjectId;
    answers: {
      question: mongoose.Types.ObjectId;
      answer: string; // Or number, if you prefer
    }[];
    scores: {
      part: string;
      score: number;
    }[];
    totalScore: number;
    startTime: Date;
    endTime: Date;
  }
  
  const takingExamSchema = new Schema<TakingExam>({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    answers: [{
      question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
      answer: { type: String, required: true }
    }],
    scores: [{
      part: { type: String, required: true },
      score: { type: Number, required: true }
    }],
    totalScore: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  });
  
  export default mongoose.model<TakingExam>('TakingExam', takingExamSchema);