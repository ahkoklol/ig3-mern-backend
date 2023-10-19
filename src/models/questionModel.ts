import mongoose, { Document, Schema } from 'mongoose';

interface Question extends Document {
  text: string;
  choices: string[];
  correctAnswer: string;
  teacherCorrection: string | null;
}

const questionSchema = new Schema<Question>({
  text: { type: String, required: true },
  choices: [String],
  correctAnswer: { type: String, required: true },
  teacherCorrection: String,
});

export default mongoose.model<Question>('Question', questionSchema);