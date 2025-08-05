import mongoose, { Schema, Document } from 'mongoose';
import mongooseSlugUpdater from 'mongoose-slug-updater';

export interface ArticleType extends Document {
  title: string;
  thumbnail: string;
  position: number;
  status: string;
  introduction: string;
  content: string;
  tags: string[];
  views: number;
  outstand: boolean;
  deleted: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const ArticleSchema = new Schema<ArticleType>({
  title: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  position: { type: Number },
  status: { type: String, default: 'ongoing' },
  introduction: { type: String },
  content: { type: String },
  tags: { type: [String] },
  views: { type: Number, default: 0 },
  outstand: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  slug: {
    type: String,
    slug: 'title',
    unique: true,
    slugPaddingSize: 4,
    permanent: false,
  },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
  deletedAt: { type: Date, default: () => new Date() },
});

mongoose.plugin(mongooseSlugUpdater);
(mongooseSlugUpdater as any).defaults = {
  slugPaddingSize: 4,
  reservedSlugs: ['admin', 'new'],
};
ArticleSchema.plugin(mongooseSlugUpdater);

export const ArticleModel =
  mongoose.models.Article || mongoose.model<ArticleType>('Article', ArticleSchema);
