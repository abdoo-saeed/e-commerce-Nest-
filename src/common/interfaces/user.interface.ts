
import { GenderEnum, ProviderEnum, RoleEnum } from "../enums";

export interface IUser {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  profilePicture?: string;
  profileCoverPictures?: string[];

  DOB?: Date;
  deletedAt?: Date;
  restoredAt?: Date;
  confirmEmail: boolean;
  changeCredentialsTime?: Date;

  gender: GenderEnum;
  provider: ProviderEnum;
  role: RoleEnum;

  createdAt?: Date;
  updatedAt?: Date;
}