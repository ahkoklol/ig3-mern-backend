import mongoose, { Document, Schema } from 'mongoose';

interface Exam extends Document {
  examNumber: number;
  questions: mongoose.Types.ObjectId[];
  time: number;
}

const examSchema = new Schema<Exam>({
  examNumber: { type: Number, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  time: { type: Number, required: true },
});

export default mongoose.model<Exam>('Exam', examSchema);