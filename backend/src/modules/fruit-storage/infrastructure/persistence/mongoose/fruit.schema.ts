import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'fruits', timestamps: true })
export class FruitDocument {
  @Prop({ required: true, unique: true, index: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  limitOfFruitToBeStored!: number;

  @Prop({ required: true, default: 0 })
  amount!: number;
}

export type FruitDocumentType = HydratedDocument<FruitDocument>;
export const FruitSchema = SchemaFactory.createForClass(FruitDocument);
