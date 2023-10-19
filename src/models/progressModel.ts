import mongoose, { Document, Schema } from 'mongoose';

interface Progress extends Document {
  year: number;
  student: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  score: number;
}

const progressSchema = new Schema<Progress>({
  year: { type: Number, required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
});

export default mongoose.model<Progress>('ProgressEntry', progressSchema);