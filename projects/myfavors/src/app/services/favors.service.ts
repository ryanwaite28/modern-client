import { Injectable } from '@angular/core';
import { MODERN_APPS, USER_RECORDS } from 'projects/_common/src/app/enums/all.enums';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { ClientService } from 'projects/_common/src/app/services/client.service';
import { UsersService } from 'projects/_common/src/app/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class FavorsService {
  constructor(
    private userService: UsersService,
    private clientService: ClientService,
  ) {}

  isFavorHelper(favor: any, you: IUser) {
    const isLead = !!favor && !!favor.favor_helpers.length && favor.favor_helpers.some((helper: any) => {
      return helper.user_id === you.id;
    });
    return isLead;
  }

  isFavorHelperLead(favor: any, you: IUser) {
    const isLead = !!favor && !!favor.favor_helpers.length && favor.favor_helpers.some((helper: any) => {
      return helper.is_lead && helper.user_id === you.id;
    });
    return isLead;
  }

  getUserFavorsAll<T = any>(user_id: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.MYFAVORS,
      USER_RECORDS.FAVORS,
      undefined,
      true,
      true
    );
  }

  getUserFavors<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.MYFAVORS,
      USER_RECORDS.FAVORS,
      min_id,
      false,
      true
    );
  }

  get_favor_by_id<T = any>(favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/${favor_id}`, `GET`);
  }

  create_favor<T = any>(data: FormData) {
    return this.clientService.sendRequest<T>(`/myfavors/favors`, `POST`, data);
  }

  update_favor<T = any>(favor_id: number, data: FormData) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/${favor_id}`, `POST`, data);
  }

  delete_favor<T = any>(favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/${favor_id}`, `DELETE`);
  }

  getUserActiveFavorHelpingsAll<T = any>(user_id: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.MYFAVORS,
      USER_RECORDS.FAVOR_HELPINGS_ACTIVE,
      undefined,
      true,
      true
    );
  }

  getUserActiveFavorHelpings<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.MYFAVORS,
      USER_RECORDS.FAVOR_HELPINGS_ACTIVE,
      min_id,
      false,
      true
    );
  }

  getUserPastFavorHelpingsAll<T = any>(user_id: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.MYFAVORS,
      USER_RECORDS.FAVOR_HELPINGS_PAST,
      undefined,
      true,
      true
    );
  }

  getUserPastFavorHelpings<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.MYFAVORS,
      USER_RECORDS.FAVOR_HELPINGS_PAST,
      min_id,
      false,
      true
    );
  }

  searchFavors<T = any>(data: any) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/search`, `POST`, data);
  }


  assignFavor<T = any>(you_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/assign-favor/${favor_id}`, `POST`);
  }

  unassignFavor<T = any>(you_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/unassign-favor/${favor_id}`, `POST`);
  }


  markHelperAsHelped<T = any>(user_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/${favor_id}/mark-helper-as-helped/${user_id}`, `POST`);
  }

  markHelperAsUnhelped<T = any>(user_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/${favor_id}/mark-helper-as-unhelped/${user_id}`, `POST`);
  }


  markFavorAsStarted<T = any>(you_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/mark-favor-as-started/${favor_id}`, `POST`);
  }

  markFavorAsCanceled<T = any>(you_id: number, favor_id: number, data?: any) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/mark-favor-as-canceled/${favor_id}`, `POST`, data);
  }

  markFavorAsUncanceled<T = any>(you_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/mark-favor-as-uncanceled/${favor_id}`, `POST`);
  }

  markFavorAsFulfilled<T = any>(you_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/mark-favor-as-fulfilled/${favor_id}`, `POST`);
  }

  createUpdate<T = any>(you_id: number, favor_id: number, data: FormData) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/create-favor-update/${favor_id}`, `POST`, data);
  }

  // addFulfilledPicture<T = any>(you_id: number, favor_id: number, data: FormData) {
  //   return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/add-delivered-picture/${favor_id}`, `POST`, data);
  // }

  payHelper<T = any>(user_id: number, favor_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/${favor_id}/pay-helper/${user_id}`, `POST`);
  }

  getUserMyfavorsSettings<T = any>(you_id: number) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/settings`, `GET`);
  }

  updateUserMyfavorsSettings<T = any>(you_id: number, data: any) {
    return this.clientService.sendRequest<T>(`/myfavors/users/${you_id}/settings`, `POST`, data);
  }
  

  sendFavorMessage<T>(data: any) {
    return this.clientService.sendRequest<T>(`/myfavors/favors/${data.favor_id}/message`, `POST`, data);
  }

}