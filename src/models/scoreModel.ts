import mongoose, { Document, Schema } from 'mongoose';

interface Score extends Document {
    examNumber: number;
    questions: number;
    score: number;
    date: Date;
    student: mongoose.Types.ObjectId;
}

const scoreSchema = new Schema<Score>({
    examNumber: { type: Number, required: true },
    questions: { type: Number, required: true },
    score: { type: Number, required: true },
    date: { type: Date, required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<Score>('Score', scoreSchema);