import { IUser } from './user.interface';
import { INotification } from './notification.interface';
import { IUserField } from './user-field.interface';
import { PlainObject } from './json-object.interface';
import { HttpStatusCode } from '../enums/http-codes.enum';

/** Common Response */

export interface CommonMessageResponse {
  message: string;
}

export interface SignOutResponse {
  online: boolean;
  successful: boolean;
  message: string;
}

export interface ErrorResponse {
  error: boolean;
  message: string;
  [key: string]: any;
}

/** GET Responses */

export interface GetRecordResponse<T> {
  data: T;
}

export interface GetSessionResponse {
  error: boolean;
  status: HttpStatusCode;
  message: string;
  you: IUser | null;
}

export interface GetUserFieldsResponse {
  user_fields: IUserField[];
}

export interface GetUserNotificationsResponse {
  notifications: INotification[];
}

export interface GetVerifySmsCode {
  message: string;
  you: IUser;
  sms_verify_results: any;
}

/** POST Responses */

export interface PostRecordResponse<T> {
  data: T;
  message: string;
  token?: string;
}

export interface SignUpResponse {
  online: boolean;
  you: IUser;
  message: string;
  token: string;
  session_id: string;
}

export interface PostUserFieldResponse {
  user_field: IUserField;
  message: string;
}

/** PUT Responses */

export interface PutRecordResponse<T> {
  updates: any;
  data: Partial<T>;
  message: string;
  token: string;
}

export interface SignInResponse {
  online: boolean;
  you: IUser;
  message: string;
  token: string;
  session_id: string;
}

export interface PutUserProfileSettingsResponse {
  update: any;
  you: IUser;
  message: string;
}

export interface PutUserPasswordResponse {
  update: any;
  message: string;
}

export interface PutUserPhoneResponse {
  update: any;
  sms_verify_results: PlainObject;
  data: IUser;
  message: string;
}

export interface PutUserIconResponse {
  update: any;
  you: IUser;
  message: string;
}

export interface PutUserWallpaperResponse {
  update: any;
  you: IUser;
  message: string;
}

export interface PutUserFieldResponse {
  update: any;
  user_field: IUserField;
  message: string;
}

/** DELETE Responses */

export interface DeleteRecordResponse {
  deletes: any;
  message: string;
  token: string;
}
