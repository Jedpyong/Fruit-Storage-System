import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'outbox_messages', timestamps: true })
export class OutboxMessageDocument extends Document {
  @Prop({ required: true })
  eventType!: string;

  @Prop({ required: true, type: Object })
  payload!: Record<string, unknown>;

  @Prop({ required: true, default: false, index: true })
  published!: boolean;
}

export const OutboxMessageSchema = SchemaFactory.createForClass(
  OutboxMessageDocument,
);
