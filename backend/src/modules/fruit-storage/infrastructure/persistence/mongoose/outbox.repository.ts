/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Model } from 'mongoose';
import { OutboxMessageDocument } from './outbox-message.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class OutboxRepository {
  constructor(
    @InjectModel(OutboxMessageDocument.name)
    private readonly model: Model<OutboxMessageDocument>,
  ) {}

  async saveMessage(
    eventType: string,
    payload: Record<string, unknown>,
    session?: any,
  ): Promise<void> {
    await this.model.create([{ eventType, payload, published: false }], {
      session,
    });
  }

  async findUnpublished(): Promise<OutboxMessageDocument[]> {
    return this.model.find({ published: false }).lean();
  }

  async markPublished(id: string): Promise<void> {
    await this.model.updateOne({ _id: id }, { published: true });
  }
}
