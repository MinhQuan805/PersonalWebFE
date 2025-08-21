import mongoose, { Schema, Document } from 'mongoose';

export interface SubscriberType extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<SubscriberType>(
  {
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
  }
);

export const SubscriberModel =
  mongoose.models.Subscriber ||
  mongoose.model<SubscriberType>('Subscriber', SubscriberSchema);
