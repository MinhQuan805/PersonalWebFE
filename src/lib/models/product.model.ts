import mongoose, { Schema, Document } from 'mongoose';
import mongooseSlugUpdater from 'mongoose-slug-updater';

export interface ProductType extends Document {
  title: string;
  status: string;
  logo: string;
  position: number;
  shortDescription: string;
  outstand: boolean;
  thumbnail: string;
  introduction: string;
  content: string;
  github: string;
  website: string;
  slug: string;
  video: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

// Khởi tạo Schema
const ProductSchema = new Schema<ProductType>({
  title: { type: String, required: true },

  status: { type: String, default: 'hidden' },
  logo: { type: String, default: '' },
  position: { type: Number },

  thumbnail: { type: String, default: '' },
  shortDescription: { type: String, default: '' },

  introduction: { type: String },

  content: { type: String, default: ''},

  github: { type: String, default: '' },

  website: { type: String, default: '' },

  slug: {
    type: String,
    slug: 'title',
    unique: true,
  },

  video: [
    {
      url: String,
      thumbnail: String,
    },
  ],

  deleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: () => new Date() },

  updatedAt: { type: Date, default: () => new Date() },

  deletedAt: { type: Date, default: () => new Date() },
});

// Kích hoạt plugin slug
mongoose.plugin(mongooseSlugUpdater);
(mongooseSlugUpdater as any).defaults = {
  slugPaddingSize: 4,
  reservedSlugs: ['admin', 'new'],
};
ProductSchema.plugin(mongooseSlugUpdater);

// Export model
export const ProductModel =
  mongoose.models.Product || mongoose.model<ProductType>('Product', ProductSchema);
