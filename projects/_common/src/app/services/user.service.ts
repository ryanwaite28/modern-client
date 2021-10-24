import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { first, flatMap, map, share, single, take } from 'rxjs/operators';
import {
  SignUpResponse,
  SignInResponse,
  GenericApiResponse,
  GetVerifySmsCode,
  UserUpdatedResponse,
} from '../interfaces/responses.interface';
import {
  PlainObject
} from '../interfaces/json-object.interface';
import { UserStoreService } from '../stores/user-store.service';
import { INotification } from '../interfaces/notification.interface';
import { IUserField } from '../interfaces/user-field.interface';
import { MODERN_APPS, USER_RECORDS } from '../enums/all.enums';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  session: GenericApiResponse | any;
  sessionChecked: boolean = false;

  constructor(
    public http: HttpClient,
    private userStore: UserStoreService,
    private clientService: ClientService,
    private utilityService: UtilityService
  ) {}

  private isFirstCall = true;

  checkUserSession() {
    return this.userStore.getChangesObs().pipe(
      flatMap((you: IUser | null) => {
        return you !== undefined
          ? of(you)
          : this.checkSession().pipe(
              map((response: GenericApiResponse) => {
                return response.data.you || null;
              })
            );
      })
    );
  }

  private checkSession() {
    const jwt = window.localStorage.getItem('rmw-modern-apps-jwt');
    if (!jwt || jwt === `undefined` || !this.utilityService.isJwtFormat(jwt)) {
      window.localStorage.removeItem('rmw-modern-apps-jwt');
      this.userStore.setState(null);
      return of(<GenericApiResponse> {
        message: `no token found`,
        data: {
          online: false,
          you: null,
          token: null,
        }
      });
    }
    return this.clientService.sendRequest<GenericApiResponse>(
      '/common/users/check-session',
      `GET`,
      null,
    ).pipe(
      map((response) => {
        this.session = response;
        this.sessionChecked = true;
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  sign_out() {
    return of().pipe(
      map(() => {
        this.userStore.setState(null);
        window.localStorage.removeItem('rmw-modern-apps-jwt');
      })
    );
  }

  verify_email(uuid: string): Observable<GenericApiResponse> {
    const endpoint = '/common/users/verify-email/' + uuid;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `GET`).pipe(
      map((response) => {
        this.userStore.setState(null);
        window.localStorage.removeItem('rmw-modern-apps-jwt');
        return response;
      })
    );
  }

  send_sms_verification(phone: string): Observable<GenericApiResponse> {
    const endpoint = '/common/users/send-sms-verification/' + phone;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verify_sms_code(params: {
    request_id: string,
    code: string,
  }): Observable<GetVerifySmsCode> {
    const { request_id, code } = params;
    const endpoint = `/common/users/verify-sms-code/request_id/${request_id}/code/${code}`;
    return this.clientService.sendRequest<GetVerifySmsCode>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  send_feedback(you_id: number, data: PlainObject) {
    const endpoint = `/common/users/${you_id}/feedback`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `POST`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** */

  get_user_by_id(id: number) {
    const endpoint = '/common/users/id/' + id;
    return this.clientService.sendRequest<GenericApiResponse<IUser>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_by_phone(phone: string) {
    const endpoint = '/common/users/phone/' + phone;
    return this.clientService.sendRequest<GenericApiResponse<IUser>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_follows(you_id: number, user_id: number) {
    const endpoint = `/common/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followers_count(user_id: number) {
    const endpoint = `/common/users/${user_id}/followers-count`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followings_count(user_id: number) {
    const endpoint = `/common/users/${user_id}/followings-count`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messagings(you_id: number, messagings_timestamp?: string, get_all: boolean = false) {
    const endpoint = get_all
      ? '/common/users/' + you_id + '/messagings/all'
      : messagings_timestamp
        ? '/common/users/' + you_id + '/messagings/' + messagings_timestamp
        : '/common/users/' + you_id + '/messagings';
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messages(you_id: number, user_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/common/users/' + you_id + '/messages/' + user_id + '/' + min_id
      : '/common/users/' + you_id + '/messages/' + user_id;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_unseen_counts(you_id: number) {
    const endpoint = `/common/users/${you_id}/unseen-counts`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // generic

  get_user_records<T>(
    user_id: number,
    app: MODERN_APPS,
    path: USER_RECORDS,
    min_id?: number,
    get_all: boolean = false,
    is_public: boolean = true
  ) {
    const partial_prefix = is_public ? '/get-' : '/';
    const endpoint = get_all
      ? '/' + app + '/users/' + user_id + partial_prefix + path + '/all'
      : min_id
        ? '/' + app + '/users/' + user_id + `${partial_prefix}` + path + '/' + min_id
        : '/' + app + '/users/' + user_id + `${partial_prefix}` + path;
    return this.clientService.sendRequest<GenericApiResponse<T>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_random_models(
    you_id: number,
    model_name: string,
    industry: string = '',
    gallup_strength: string = '',
    pred_ref_profile: string = '',
    cause: string = '',
  ) {
    const endpoint = `/common/users/${you_id}/random?model_name=${model_name}&industry=${industry}&gallup_strength=${gallup_strength}&pred_ref_profile=${pred_ref_profile}&cause=${cause}`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_feed(you_id: number, feed_type: string, min_id?: number) {
    const endpoint = min_id
      ? `/common/users/${you_id}/feed/${min_id}?feed_type=${feed_type}`
      : `/common/users/${you_id}/feed?feed_type=${feed_type}`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //

  getUserNotificationsAll<T = any>(user_id: number) {
    return this.get_user_records<T>(
      user_id,
      MODERN_APPS.COMMON,
      USER_RECORDS.NOTIFICATIONS,
      undefined,
      true,
      false
    );
  }

  getUserNotifications<T = any>(user_id: number, min_id?: number) {
    return this.get_user_records<T>(
      user_id,
      MODERN_APPS.COMMON,
      USER_RECORDS.NOTIFICATIONS,
      min_id,
      false,
      false
    );
  }

  /** POST */

  sign_up(data: PlainObject) {
    return this.clientService.sendRequest<SignUpResponse>('/common/users', `POST`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  create_user_field(id: number, data: PlainObject) {
    return this.clientService.sendRequest<GenericApiResponse<IUserField>>(`/common/users/${id}/user-field`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  follow_user(you_id: number, user_id: number) {
    const endpoint = `/common/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<GenericApiResponse<any>>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  send_user_message(you_id: number, user_id: number, data: PlainObject) {
    return this.clientService.sendRequest<GenericApiResponse<any>>(`/common/users/${you_id}/send-message/${user_id}`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_user_last_opened(you_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<any>>(`/common/users/${you_id}/notifications/update-last-opened`, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  update_conversation_last_opened(you_id: number, conversation_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<any>>(`/common/users/${you_id}/conversations/${conversation_id}/update-last-opened`, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  
  /** PUT */
  
  create_stripe_account<T = any>(you_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<T>>(
      `/common/users/${you_id}/create-stripe-account`, `PUT`
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  verify_stripe_account<T = any>(you_id: number) {
    return this.clientService.sendRequest<GenericApiResponse<T>>(
      `/common/users/${you_id}/verify-stripe-account`, `PUT`
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  sign_in(data: PlainObject) {
    return this.clientService.sendRequest<SignInResponse>('/common/users', `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        return response;
      })
    );
  }

  update_info(id: number, data: PlainObject) {
    const endpoint = `/common/users/${id}/info`;
    return this.clientService.sendRequest<UserUpdatedResponse>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_password(id: number, data: PlainObject) {
    const endpoint = `/common/users/${id}/password`;
    return this.clientService.sendRequest<UserUpdatedResponse>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_phone(id: number, data: PlainObject) {
    const endpoint = `/common/users/${id}/phone`;
    return this.clientService.sendRequest<UserUpdatedResponse>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_icon(id: number, formData: FormData) {
    const endpoint = `/common/users/${id}/icon`;
    return this.clientService.sendRequest<UserUpdatedResponse>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_wallpaper(id: number, formData: FormData) {
    const endpoint = `/common/users/${id}/wallpaper`;
    return this.clientService.sendRequest<UserUpdatedResponse>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.mergeState(response.data.you);
        return response;
      })
    );
  }

  update_user_field(you_id: number, id: number, data: PlainObject) {
    const endpoint = `/common/users/${you_id}/user-field/${id}`;
    return this.clientService.sendRequest<GenericApiResponse<IUserField>>(endpoint, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /** DELETE */

  delete_user_field(you_id: number, id: number) {
    const endpoint = `/common/users/${you_id}/user-field/${id}`;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  unfollow_user(you_id: number, user_id: number) {
    const endpoint = `/common/users/${you_id}/follows/${user_id}`;
    return this.clientService.sendRequest<GenericApiResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
