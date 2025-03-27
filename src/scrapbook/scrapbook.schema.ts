import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

class Owner {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  displayName: string;
}

class SharedGroup {
  @Prop({ required: true })
  groupId: string;

  @Prop({ type: Map, of: Boolean })
  permissions: Map<string, boolean>;
}

class Author {
  @Prop({ required: true })
  userId: string;

  @Prop()
  username?: string;

  @Prop({ required: true })
  login: string;
}

class LayerSchema {
  @Prop({ default: 0 })
  x: number;

  @Prop({ default: 0 })
  y: number;

  @Prop({ type: Number, default: null })
  z: number;

  @Prop({ type: Number, default: null })
  w: number | null;

  @Prop({ type: Number, default: null })
  h: number | null;

  @Prop({ type: String, default: null })
  media: string | null;
}

// Scrapbook Schema
@Schema({
  collection: 'scrapbook',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
})
export class Scrapbook {
  @Prop({ required: true, type: String, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  icon?: string;

  @Prop({ default: 0 })
  trashed: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Owner })
  owner: Owner;

  @Prop({ type: [SharedGroup] })
  shared: SharedGroup[];

  @Prop([String])
  pageOrder: string[];

  @Prop()
  version: number;

  @Prop()
  ingest_job_state: string;
}

export const ScrapbookSchema = SchemaFactory.createForClass(Scrapbook);

// Page Schema
@Schema({
  collection: 'scrapbookPage',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
})
export class Page {
  @Prop({ required: true, type: String, default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Scrapbook',
    required: true 
  })
  scrapbook: Types.ObjectId;

  @Prop({ type: Author })
  author: Author;

  @Prop()
  version: number;

  @Prop({ type: String, default: null })
  background: string | null;

  @Prop({ type: String, default: null })
  backgroundColor: string | null;

  @Prop({ type: [LayerSchema] })
  layers: LayerSchema[];
}

export const PageSchema = SchemaFactory.createForClass(Page);