import mongoose, { Document, Schema } from 'mongoose';

interface Exam extends Document {
  category: string;
  part: string;
  level: string;
  questions: mongoose.Types.ObjectId[];
  time: number;
  dateTaken: Date;
}

const examSchema = new Schema<Exam>({
  category: { type: String, required: true },
  part: { type: String, required: true },
  level: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  time: { type: Number, required: true },
  dateTaken: { type: Date },
});

export default mongoose.model<Exam>('Exam', examSchema);