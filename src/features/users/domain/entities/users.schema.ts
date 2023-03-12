import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

@Schema({ _id: false })
class AccountData {
  @Prop({ required: true, unique: true, type: String })
  login: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  passwordHash: string;

  @Prop({
    required: true,
    type: String,
    default: () => new Date().toISOString(),
  })
  createdAt: string;
}

const AccountDataSchema = SchemaFactory.createForClass(AccountData);

@Schema({ _id: false })
class EmailInfo {
  @Prop({ required: true, type: Boolean, default: false })
  isConfirmed: boolean;

  @Prop({ required: true, type: String })
  confirmationCode: string;
}

const EmailInfoSchema = SchemaFactory.createForClass(EmailInfo);

@Schema({ _id: false, id: false, versionKey: false })
class PasswordRecoveryInfo {
  @Prop({ required: true, type: Boolean, default: true })
  recoveryStatus: boolean;
  @Prop({ type: String })
  recoveryCode: string;
}

const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecoveryInfo);

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    default: randomUUID,
    unique: true,
    type: String,
  })
  id: string;

  @Prop({ required: true, type: AccountDataSchema })
  accountData: AccountData;

  @Prop({ required: true, type: EmailInfoSchema })
  emailInfo: EmailInfo;

  @Prop({ required: true, type: PasswordRecoverySchema })
  passwordRecoveryInfo: PasswordRecoveryInfo;

  createUserViewModel() {
    return {
      id: this.id,
      login: this.accountData.login,
      email: this.accountData.email,
      createdAt: this.accountData.createdAt,
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  createUserViewModel: User.prototype.createUserViewModel,
};
