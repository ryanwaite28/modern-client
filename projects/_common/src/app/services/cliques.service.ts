import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PlainObject } from '../interfaces/json-object.interface';
import { GetRecordResponse, PostRecordResponse, DeleteRecordResponse, PutRecordResponse } from '../interfaces/responses.interface';
import { UserStoreService } from '../stores/user-store.service';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class CliquesService {
  constructor(
    private clientService: ClientService,
  ) {}

  search_users(you_id: number, clique_id: number, query_term: string) {
    const endpoint = `/users/${you_id}/cliques/${clique_id}/search-users?query_term=${query_term}`;
    return this.clientService.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  add_clique_member(you_id: number, clique_id: number, user_id: number) {
    const endpoint = '/users/' + you_id + '/cliques/' + clique_id + '/members/' + user_id;
    return this.clientService.sendRequest<PostRecordResponse<any>>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  remove_clique_member(you_id: number, clique_id: number, user_id: number) {
    const endpoint = '/users/' + you_id + '/cliques/' + clique_id + '/members/' + user_id;
    return this.clientService.sendRequest<DeleteRecordResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  leave_clique(you_id: number, clique_id: number) {
    const endpoint = '/users/' + you_id + '/cliques/' + clique_id + '/members/leave';
    return this.clientService.sendRequest<DeleteRecordResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_interest(you_id: number, clique_id: number) {
    const endpoint = `/users/${you_id}/cliques/${clique_id}/interests`;
    return this.clientService.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_membership(you_id: number, clique_id: number) {
    const endpoint = `/users/${you_id}/cliques/${clique_id}/membership`;
    return this.clientService.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  show_interest(you_id: number, clique_id: number) {
    const endpoint = `/users/${you_id}/cliques/${clique_id}/interests`;
    return this.clientService.sendRequest<PostRecordResponse<any>>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  remove_interest(you_id: number, clique_id: number) {
    const endpoint = `/users/${you_id}/cliques/${clique_id}/interests`;
    return this.clientService.sendRequest<DeleteRecordResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_clique_members(you_id: number, clique_id: number, min_id?: number, get_all?: boolean) {
    const endpoint = get_all
      ? '/users/' + you_id + '/cliques/' + clique_id + '/members/all'
      : min_id
        ? '/users/' + you_id + '/cliques/' + clique_id + '/members/' + min_id
        : '/users/' + you_id + '/cliques/' + clique_id + '/members';
    return this.clientService.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_clique(
    id: number
  ) {
    return this.clientService.sendRequest<GetRecordResponse<any>>(`/cliques/${id}`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_clique_interests(clique_id: number, min_id?: number, get_all?: boolean) {
    const endpoint = get_all
      ? '/cliques/' + clique_id + '/interests/all'
      : min_id
        ? '/cliques/' + clique_id + '/interests/' + min_id
        : '/cliques/' + clique_id + '/interests';
    return this.clientService.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_user_clique(
    id: number,
    data: PlainObject
  ) {
    return this.clientService.sendRequest<PostRecordResponse<any>>(`/users/${id}/cliques`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_user_clique(
    id: number,
    clique_id: number,
    data: PlainObject
  ) {
    return this.clientService.sendRequest<PutRecordResponse<any>>(`/users/${id}/cliques/${clique_id}`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_user_clique(
    id: number,
    clique_id: number,
  ) {
    return this.clientService.sendRequest<DeleteRecordResponse>(`/users/${id}/cliques/${clique_id}`, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /** */

  send_clique_member_request(creator_id: number, clique_id: number, user_id: number) {
    const endpoint = `/users/${creator_id}/cliques/${clique_id}/member-requests/${user_id}`;
    return this.clientService.sendRequest<PostRecordResponse<any>>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  cancel_clique_member_request(creator_id: number, clique_id: number, member_request_id: number) {
    const endpoint = `/users/${creator_id}/cliques/${clique_id}/member-requests/${member_request_id}/cancel`;
    return this.clientService.sendRequest<PostRecordResponse<any>>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  accept_clique_member_request(creator_id: number, clique_id: number, member_request_id: number) {
    const endpoint = `/users/${creator_id}/cliques/${clique_id}/member-requests/${member_request_id}/accept`;
    return this.clientService.sendRequest<PostRecordResponse<any>>(endpoint, `PUT`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  decline_clique_member_request(creator_id: number, clique_id: number, member_request_id: number) {
    const endpoint = `/users/${creator_id}/cliques/${clique_id}/member-requests/${member_request_id}/decline`;
    return this.clientService.sendRequest<PostRecordResponse<any>>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
