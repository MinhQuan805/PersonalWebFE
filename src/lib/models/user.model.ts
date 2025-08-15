import mongoose, { Schema, Document } from 'mongoose';

export interface UserType extends Document {
  title: string;
  email: string;
  password: string;
  status: string;
  role: string;
  deleted: boolean;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const UserSchema = new Schema<UserType>({
  title: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'active' },
  role: { type: String, default: 'client' },
  deleted: { type: Boolean, default: false },
  accessToken: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
  deletedAt: { type: Date, default: null },
});

export const UserModel =
  mongoose.models.User || mongoose.model<UserType>('User', UserSchema);
