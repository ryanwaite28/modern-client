import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PlainObject } from '../interfaces/json-object.interface';
import {
  GetRecordResponse,
  PostRecordResponse,
  DeleteRecordResponse,
  PutRecordResponse
} from '../interfaces/responses.interface';
import { UserStoreService } from '../stores/user-store.service';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService extends ClientService {
  constructor(
    public http: HttpClient,
    private userStore: UserStoreService,
  ) {
    super(http);
  }

  check_interest(you_id: number, resource_id: number) {
    const endpoint = `/users/${you_id}/resources/${resource_id}/interests`;
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  show_interest(you_id: number, resource_id: number) {
    const endpoint = `/users/${you_id}/resources/${resource_id}/interests`;
    return this.sendRequest<PostRecordResponse<any>>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  remove_interest(you_id: number, resource_id: number) {
    const endpoint = `/users/${you_id}/resources/${resource_id}/interests`;
    return this.sendRequest<DeleteRecordResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_resource(
    id: number
  ) {
    return this.sendRequest<GetRecordResponse<any>>(`/resources/${id}`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_resource_interests(resource_id: number, min_id?: number, get_all?: boolean) {
    const endpoint = get_all
      ? '/resources/' + resource_id + '/interests/all'
      : min_id
        ? '/resources/' + resource_id + '/interests/' + min_id
        : '/resources/' + resource_id + '/interests';
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_user_resource(
    id: number,
    data: PlainObject
  ) {
    return this.sendRequest<PostRecordResponse<any>>(`/users/${id}/resources`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_user_resource(
    id: number,
    resource_id: number,
    data: PlainObject
  ) {
    return this.sendRequest<PutRecordResponse<any>>(`/users/${id}/resources/${resource_id}`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_user_resource(
    id: number,
    resource_id: number,
  ) {
    return this.sendRequest<DeleteRecordResponse>(`/users/${id}/resources/${resource_id}`, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
