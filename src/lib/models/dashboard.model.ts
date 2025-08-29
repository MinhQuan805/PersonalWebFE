import mongoose, { Schema, Document, Model } from 'mongoose';

export interface DashboardType extends Document {
  intro: {
    greeting: string;
    name: string;
    highlight: string;
    description: string[];
    resumeFile: string;
    avatar: string;
  };
  about: {
    name: string;
    headline: string;
    story: string[];
    logo: string;
    info: {
      birthday: string;
      age: number;
      address: string;
      phone: string;
      email: string;
    };
    socials: {
      linkedin: string;
      github: string;
      facebook: string;
    };
    tags?: string[];
  };
  testimonials: {
    avatar: string;
    quote: string;
    name: string;
    role: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const DashboardSchema = new Schema<DashboardType>(
  {
    intro: {
      greeting: { type: String, required: true },
      name: { type: String, required: true },
      highlight: { type: String },
      description: [{ type: String }],
      resumeFile: { type: String },
      avatar: { type: String },
    },
    about: {
      name: { type: String, required: true },
      headline: { type: String },
      story: [{ type: String }],
      logo: { type: String },
      info: {
        birthday: { type: String },
        age: { type: Number },
        address: { type: String },
        phone: { type: String },
        email: { type: String },
      },
      socials: {
        linkedin: { type: String },
        github: { type: String },
        facebook: { type: String },
      },
      tags: [{ type: String }],
    },
    testimonials: [
      {
        avatar: { type: String },
        quote: { type: String },
        name: { type: String },
        role: { type: String },
      },
    ],
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    deletedAt: { type: Date },
  },
  { collection: 'dashboards' }
);

export const DashboardModel: Model<DashboardType> =
  mongoose.models.Dashboard ||
  mongoose.model<DashboardType>('Dashboard', DashboardSchema);
