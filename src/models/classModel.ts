import mongoose, { Document, Schema } from 'mongoose';

interface Class extends Document {
  name: string;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
}

const classSchema = new Schema<Class>({
  name: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<Class>('Class', classSchema);