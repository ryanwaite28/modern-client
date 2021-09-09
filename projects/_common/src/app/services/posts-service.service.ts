import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { REACTION_TYPES } from '../enums/all.enums';
import { PlainObject } from '../interfaces/json-object.interface';
import {
  GetRecordResponse,
  PostRecordResponse,
  PutRecordResponse,
  DeleteRecordResponse
} from '../interfaces/responses.interface';
import { IPost, IPostReaction } from '../interfaces/_all.interface';
import { IReactionsCounts } from '../interfaces/_common.interface';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_post(post_id: number) {
    return this.clientService.sendRequest<GetRecordResponse<IPost>>(`/posts/${post_id}`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_post_comments_count(post_id: number) {
    return this.clientService.sendRequest<GetRecordResponse<any>>(`/posts/${post_id}/comments/count`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_post_reactions_count(post_id: number) {
    return this.clientService.sendRequest<GetRecordResponse<IReactionsCounts>>(`/posts/${post_id}/user-reactions/count`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_reaction(params: { post_id: number; user_id: number; }) {
    const { post_id, user_id } = params;
    return this.clientService.sendRequest<GetRecordResponse<any>>(`/posts/${post_id}/user-reaction/${user_id}`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_post(data: PlainObject) {
    return this.clientService.sendRequest<PostRecordResponse<IPost>>(`/posts`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_post(params: { post_id: number; data: PlainObject }) {
    const { post_id, data } = params;
    return this.clientService.sendRequest<PutRecordResponse<IPost>>(`/posts/${post_id}`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_post(post_id: number) {
    return this.clientService.sendRequest<DeleteRecordResponse>(`/posts/${post_id}`, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  toggle_user_reaction(params: { post_id: number; data: { reaction: REACTION_TYPES } }) {
    const { post_id, data } = params;
    return this.clientService.sendRequest<PutRecordResponse<IPostReaction>>(`/posts/${post_id}/user-reaction`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
