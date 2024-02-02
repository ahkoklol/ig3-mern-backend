import mongoose, { Document, Schema } from 'mongoose';

interface Part extends Document {
    category: string;
    part: string;
    questions: mongoose.Types.ObjectId[];
    time: number;
}

const partSchema = new Schema<Part>({
    category: { type: String, required: true },
    part: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    time: { type: Number, required: true },
});

export default mongoose.model<Part>('Part', partSchema);