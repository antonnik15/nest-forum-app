import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionDocument } from '../domain/entities/reaction.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReactionRepository {
  constructor(
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,
  ) {}

  async updateReaction(newReaction: Reaction) {
    await this.reactionModel.updateOne(
      { userId: newReaction.userId, parentId: newReaction.parentId },
      { $set: newReaction },
      { upsert: true },
    );
    return;
  }
}
