import { Injectable } from '@nestjs/common';
import {
  Reaction,
  ReactionStatusEnum,
} from '../domain/entities/reaction.schema';
import { ReactionRepository } from '../infrastructure/reaction-repository';

@Injectable()
export class ReactionService {
  constructor(private readonly reactionRepository: ReactionRepository) {}
  updateReactionByParenId(
    parentId: string,
    userId: string,
    userLogin: string,
    reactionStatus: ReactionStatusEnum,
  ) {
    const newReaction: Reaction = {
      parentId,
      userId,
      userLogin,
      reactionStatus,
      addedAt: new Date().toISOString(),
    };

    return this.reactionRepository.updateReaction({ ...newReaction });
  }
}
