import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { REACTION_TYPES } from '../enums/all.enums';
import { PlainObject } from './json-object.interface';

export interface ICommonModel {
  id:                      number;
  date_created:            string;
  created_at:              string;
  updated_at:              string;
  deleted_at:              string;
  uuid:                    string;
}

export interface IFormSubmitEvent {
  formData: FormData;
  payload: PlainObject;
  form: FormGroup;
  formElm: ElementRef<HTMLFormElement>;
  photoInput: ElementRef<HTMLInputElement>;
}

export interface IReaction extends ICommonModel {
  name: string;
}

export interface IReactionsCounts {
  total_count: number;
  like_count: number;
  love_count: number;
  idea_count: number;
  confused_count: number;
}

export const ReactionsCountsPropByReactionType: PlainObject = {
  [REACTION_TYPES.LIKE]: 'like_count',
  [REACTION_TYPES.LOVE]: 'love_count',
  [REACTION_TYPES.IDEA]: 'idea_count',
  [REACTION_TYPES.CONFUSED]: 'confused_count',
};

// type Extend<T> = {
//   [P in keyof T]: T[P];
//   [T: string]: any;
// };