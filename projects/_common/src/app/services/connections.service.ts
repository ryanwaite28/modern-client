import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserStoreService } from '../stores/user-store.service';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_connections_count(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/connections/count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_connection(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/connections/${user_id}/check`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_connection_request(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/connections/${user_id}/check-request`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  send_connection_request(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/connections/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  cancel_connection_request(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/connections/${user_id}/cancel`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  accept_connection_request(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/connections/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  decline_connection_request(you_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/connections/${user_id}/decline`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
