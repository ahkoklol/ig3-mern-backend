import mongoose, { Document, Schema } from 'mongoose';

interface Class extends Document {
  name: string;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  startDate: Date;
}

const classSchema = new Schema<Class>({
  name: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date, required: true },
});

export default mongoose.model<Class>('Class', classSchema);