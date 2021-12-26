import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MODERN_APPS, USER_RECORDS } from 'projects/_common/src/app/enums/all.enums';
import { ServiceMethodResults } from 'projects/_common/src/app/interfaces/_common.interface';
import { ClientService } from 'projects/_common/src/app/services/client.service';
import { UserService } from 'projects/_common/src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  constructor(
    private userService: UserService,
    private clientService: ClientService,
  ) {}


  getUserDeliveriesAll<T = any>(user_id: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERIES,
      undefined,
      true,
      true
    );
  }

  getUserDeliveries<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERIES,
      min_id,
      false,
      true
    );
  }

  get_delivery_by_id<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}`, `GET`);
  }

  create_delivery<T = any>(data: FormData) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries`, `POST`, data);
  }

  delete_delivery<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}`, `DELETE`);
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
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.DELIVERME,
      USER_RECORDS.DELIVERINGS,
      min_id,
      false,
      true
    );
  }

  getUserDelivering<T = any>(user_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${user_id}/delivering`, `GET`);
  }

  findAvailableDeliveryByFromCityAndState<T = any>(city: string, state: string) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/find-available-from/city/${city}/state/${state}`, `GET`);
  }

  findAvailableDeliveryByToCityAndState<T = any>(city: string, state: string) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/find-available-to/city/${city}/state/${state}`, `GET`);
  }

  findAvailableDelivery<T = any>(data: any) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/find-available`, `POST`, data);
  }

  assignDelivery<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/assign-delivery/${delivery_id}`, `POST`);
  }

  unassignDelivery<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/unassign-delivery/${delivery_id}`, `POST`);
  }

  markDeliveryAsPickedUp<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-picked-up/${delivery_id}`, `POST`);
  }

  markDeliveryAsDroppedOff<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-dropped-off/${delivery_id}`, `POST`);
  }

  markDeliveryAsReturned<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-returned/${delivery_id}`, `POST`);
  }

  markDeliveryAsCompleted<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/mark-delivery-as-completed/${delivery_id}`, `POST`);
  }

  createTrackingUpdate<T = any>(you_id: number, delivery_id: number, data: FormData) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/create-tracking-update/${delivery_id}`, `POST`, data);
  }

  addDeliveredPicture<T = any>(you_id: number, delivery_id: number, data: FormData) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/add-delivered-picture/${delivery_id}`, `POST`, data);
  }

  payCarrier<T = any>(you_id: number, delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/pay-carrier/${delivery_id}`, `POST`);
  }

  getUserDelivermeSettings<T = any>(you_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/settings`, `GET`);
  }

  updateUserDelivermeSettings<T = any>(you_id: number, data: any) {
    return this.clientService.sendRequest<T>(`/deliverme/users/${you_id}/settings`, `POST`, data);
  }

  searchDeliveries<T = any>(data: any) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/search`, `POST`, data);
  }

  sendDeliveryMessage<T = any>(data: any) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${data.delivery_id}/message`, `POST`, data);
  }

  createCheckoutSession<T = any>(delivery_id: number) {
    return this.clientService.sendRequest<T>(`/deliverme/deliveries/${delivery_id}/create-checkout-session`, `POST`);
  }

  browseRecent<T = any>(delivery_id?: number) {
    const endpoint = delivery_id
      ? `/deliverme/deliveries/browse-recent/${delivery_id}`
      : `/deliverme/deliveries/browse-recent`;
    return this.clientService.sendRequest<T>(endpoint, `POST`, null);
  }

  browseMap<T = any>(params: {
    northEast: { lat: number, lng: number },
    southWest: { lat: number, lng: number },
  }) {
    const { northEast, southWest } = params;
    const endpoint = `/deliverme/deliveries/browse-map/swlat/${southWest.lat}/swlng/${southWest.lng}/nelat/${northEast.lat}/nelng/${northEast.lng}`;
    return this.clientService.sendRequest<T>(endpoint, `POST`, null);
  }
}
