import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { USER_RECORDS, REACTION_TYPES } from '../enums/all.enums';
import { PlainObject } from '../interfaces/json-object.interface';
import {
  GetRecordResponse,
  PostRecordResponse,
  PutRecordResponse,
  DeleteRecordResponse
} from '../interfaces/responses.interface';
import { IPostComment, IPostReaction } from '../interfaces/_all.interface';
import { IReactionsCounts } from '../interfaces/_common.interface';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService extends ClientService {

  constructor(
    public http: HttpClient,
  ) {
    super(http);
  }

  get_comments(params: {
    parent_id: number;
    min_id?: number;
    get_all?: boolean;
    model_type: USER_RECORDS;
  }) {
    const { parent_id, min_id, get_all, model_type } = params;
    const endpoint = get_all
      ? '/' + model_type + '/' + parent_id + '/comments/all'
      : min_id
        ? '/' + model_type + '/' + parent_id + '/comments/' + min_id
        : '/' + model_type + '/' + parent_id + '/comments';
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_comment_replies_count(params: {
    parent_id: number;
    comment_id: number;
    model_type: USER_RECORDS;
  }) {
    const { parent_id, comment_id, model_type } = params;
    return this.sendRequest<GetRecordResponse<number>>(`/${model_type}/${parent_id}/comments/${comment_id}/replies/count`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_comment_reactions_count(params: {
    parent_id: number;
    comment_id: number;
    model_type: USER_RECORDS;
  }) {
    const { parent_id, comment_id, model_type } = params;
    return this.sendRequest<GetRecordResponse<IReactionsCounts>>(`/${model_type}/${parent_id}/comments/${comment_id}/user-reactions/count`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_reaction(params: {
    parent_id: number;
    comment_id: number;
    user_id: number;
    model_type: USER_RECORDS;
  }) {
    const { parent_id, comment_id, user_id, model_type } = params;
    return this.sendRequest<GetRecordResponse<any>>(`/${model_type}/${parent_id}/comments/${comment_id}/user-reaction/${user_id}`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_comment(params: {
    parent_id: number;
    data: PlainObject;
    model_type: USER_RECORDS;
  }) {
    const { parent_id, data, model_type } = params;
    return this.sendRequest<PostRecordResponse<IPostComment>>(`/${model_type}/${parent_id}/comments`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_comment(params: {
    parent_id: number;
    comment_id: number;
    data: PlainObject;
    model_type: USER_RECORDS;
  }) {
    const { parent_id, comment_id, data, model_type } = params;
    return this.sendRequest<PutRecordResponse<IPostComment>>(`/${model_type}/${parent_id}/comments/${comment_id}`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_comment(params: {
    parent_id: number;
    comment_id: number;
    model_type: USER_RECORDS;
  }) {
    const { parent_id, comment_id, model_type } = params;
    return this.sendRequest<DeleteRecordResponse>(`/${model_type}/${parent_id}/comments/${comment_id}`, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  toggle_user_reaction(params: {
    parent_id: number;
    comment_id: number;
    model_type: USER_RECORDS;
    data: { reaction: REACTION_TYPES }
  }) {
    const { parent_id, comment_id, data, model_type } = params;
    return this.sendRequest<PutRecordResponse<IPostReaction>>(`/${model_type}/${parent_id}/comments/${comment_id}/user-reaction`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
