import { IsEnum, IsString } from 'class-validator';
import { ReactionStatusEnum } from '../../domain/entities/reaction.schema';

export class ReactionStatusDto {
  @IsString()
  @IsEnum(ReactionStatusEnum)
  likeStatus: ReactionStatusEnum;
}
