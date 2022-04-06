import { REACTION_TYPES } from '../enums/all.enums';
import { IUser } from './user.interface';
import { ICommonModel, IReaction } from './_common.interface';

export interface IClique extends ICommonModel {
  creator_id:          number;
  title:               string;
  summary:             string;
  industry:            string;
  icon_link:           string;
  icon_id:             string;
  visibility:          string;
}

export interface INotice extends ICommonModel {
  owner_id:            number;

  parent_id:           number;
  quote_id:            number;
  share_id:            number;

  body:                string;
  tags:                string;
  is_explicit:         boolean;
  is_private:          boolean;
  visibility:          string;
  last_edited:         string;
  date_created:        string;
  uuid:                string;
}

export interface IResource extends ICommonModel {
  owner_id:            number;
  resource_type:       string;
  industry:            string;
  title:               string;
  link:                string;
  icon_link:           string;
  icon_id:             string;
  description:         string;
  visibility:          string;
}

export interface IRecipe extends ICommonModel {
  creator_id:          number;
  title:               string;
  description:         string;
  youtube_link:        string;
  youtube_embed:       string; 
  tags:                string;
  image_link:          string;
  image_id:            string;
  visibility:          string;
  creator?:            IUser;
  ingredients?:        IRecipeIngredient[];
}

export interface IRecipeIngredient extends ICommonModel {
  creator_id:          number;
  recipe_id:           number;
  name:                string;
  notes:               string;
  tags:                string;
  image_link:          string;
  image_id:            string;
}

export interface IPhoto extends ICommonModel {
  owner_id:            number;
  caption:             string;
  photo_link:          string;
  photo_id:            string;
  is_explicit:         boolean;
  is_private:          boolean;
}

export interface IVideo extends ICommonModel {
  owner_id:            number;
  caption:             string;
  video_link:          string;
  video_id:            number;
  is_explicit:         boolean;
  is_private:          boolean;
}

export interface IAudio extends ICommonModel {
  owner_id:            number;
  caption:             string;
  audio_link:          string;
  audio_id:            string;
  is_explicit:         boolean;
  is_private:          boolean;
}

export interface IPostPhoto {
  post_id:             number;
  photo_id:            number;
  photo?:              IPhoto;
}

export interface IPost extends ICommonModel {
  owner_id:            number;
  title:               string;
  body:                string;
  tags:                string;
  industry:            string;
  is_explicit:         boolean;
  is_private:          boolean;
  visibility:          string;
  last_edited:         string;

  owner?:              IUser;
  photos?:             IPostPhoto[];
}
export interface IPostViewer extends ICommonModel {
  owner_id:            number;
  user_id:             number;
  post_id:             number;
  owner?:              IUser;
  user?:               IUser;
}
export interface IPostReaction extends ICommonModel {
  reaction:            REACTION_TYPES;
  owner_id:            number;
  post_id:             number;
  reaction_id:         number;
  owner?:              IUser;
}

export interface ICommentModel extends ICommonModel {
  owner_id:            number;
  // post_id:             number;
  body:                string;
  last_edited:         string;
  owner?:              IUser;
}

export interface IPostComment extends ICommentModel {
  post_id:             number;
}
export interface IPostCommentReaction extends ICommonModel {
  reaction:            REACTION_TYPES;
  owner_id:            number;
  comment_id:          number;
  reaction_id:         number;
  owner?:              IUser;
}

export interface IPostCommentReply extends ICommonModel {
  owner_id:            number;
  comment_id:          number;
  body:                string;
  last_edited:         string;
  owner?:              IUser;
}
export interface IPostCommentReplyReaction extends ICommonModel {
  reaction:            REACTION_TYPES;
  owner_id:            number;
  reply_id:            number;
  reaction_id:         number;
  owner?:              IUser;
}

export interface INavigatorGeoLocation {
  position: any,
  lat:  number,
  lng: number,
}

// export interface IPostComment extends ICommentModel {
//   post_id:             number;
// }