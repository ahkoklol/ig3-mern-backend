import mongoose, { Document, Schema } from 'mongoose';

interface Question extends Document {
  text: string;
  choices: string[];
  correctAnswer: string;
  teacherCorrection?: string;
}

const questionSchema = new Schema<Question>({
  text: { type: String, required: true },
  choices: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  teacherCorrection: { type: String, required: false },
});

export default mongoose.model<Question>('Question', questionSchema);