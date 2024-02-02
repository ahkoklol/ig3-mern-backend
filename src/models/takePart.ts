import mongoose, { Document, Schema } from 'mongoose';

interface TakingPart extends Document {
    student: mongoose.Types.ObjectId;
    part: mongoose.Types.ObjectId;
    answers: {
      question: mongoose.Types.ObjectId;
      answer: string; // Or number, if you prefer
    }[];
    totalScore: number;
    startTime: Date;
    endTime: Date;
  }
  
  const takingPartSchema = new Schema<TakingPart>({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    part: { type: Schema.Types.ObjectId, ref: 'Part', required: true },
    answers: [{
      question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
      answer: { type: String, required: true }
    }],
    totalScore: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  });
  
  export default mongoose.model<TakingPart>('TakingPart', takingPartSchema);