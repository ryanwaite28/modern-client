import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MODERN_APPS, USER_RECORDS } from 'projects/_common/src/app/enums/all.enums';
import { ClientService } from 'projects/_common/src/app/services/client.service';
import { UserService } from 'projects/_common/src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService extends ClientService {
  constructor(
    public http: HttpClient,
    private userService: UserService
  ) {
    super(http);
  }


  getUserDeliveriesAll<T = any>(user_id: number) {
    return this.userService.get_user_records(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERIES,
      undefined,
      true,
      true
    );
  }

  getUserDeliveries<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERIES,
      min_id,
      false,
      true
    );
  }

  create_delivery<T = any>(data: FormData) {
    return this.sendRequest<T>(`/deliverme/deliveries`, `POST`, data);
  }

  delete_delivery<T = any>(delivery_id: number) {
    return this.sendRequest<T>(`/deliverme/deliveries/${delivery_id}`, `DELETE`);
  }

  getUserPastDeliveringsAll<T = any>(user_id: number) {
    return this.userService.get_user_records(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERINGS,
      undefined,
      true,
      true
    );
  }

  getUserPastDeliverings<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERINGS,
      min_id,
      false,
      true
    );
  }

  getUserDelivering<T = any>(user_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${user_id}/delivering`, `GET`);
  }

  findAvailableDeliveryByFromCityAndState<T = any>(city: string, state: string) {
    return this.sendRequest<T>(`/deliverme/deliveries/find-available-from/city/${city}/state/${state}`, `GET`);
  }

  findAvailableDeliveryByToCityAndState<T = any>(city: string, state: string) {
    return this.sendRequest<T>(`/deliverme/deliveries/find-available-to/city/${city}/state/${state}`, `GET`);
  }

  findAvailableDelivery<T = any>(data: any) {
    return this.sendRequest<T>(`/deliverme/deliveries/find-available`, `POST`, data);
  }

  assignDelivery<T = any>(you_id: number, delivery_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/assign-delivery/${delivery_id}`, `POST`);
  }

  unassignDelivery<T = any>(you_id: number, delivery_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/unassign-delivery/${delivery_id}`, `POST`);
  }

  markDeliveryAsPickedUp<T = any>(you_id: number, delivery_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-picked-up/${delivery_id}`, `POST`);
  }

  markDeliveryAsDroppedOff<T = any>(you_id: number, delivery_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-dropped-off/${delivery_id}`, `POST`);
  }

  markDeliveryAsCompleted<T = any>(you_id: number, delivery_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-completed/${delivery_id}`, `POST`);
  }

  createTrackingUpdate<T = any>(you_id: number, delivery_id: number, data: FormData) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/create-tracking-update/${delivery_id}`, `POST`, data);
  }

  addDeliveredPicture<T = any>(you_id: number, delivery_id: number, data: FormData) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/add-delivered-picture/${delivery_id}`, `POST`, data);
  }

  payCarrier<T = any>(you_id: number, delivery_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/pay-carrier/${delivery_id}`, `POST`);
  }

  getUserDelivermeSettings<T = any>(you_id: number) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/settings`, `GET`);
  }

  updateUserDelivermeSettings<T = any>(you_id: number, data: any) {
    return this.sendRequest<T>(`/deliverme/users/${you_id}/settings`, `POST`, data);
  }
}
