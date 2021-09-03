import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { first, flatMap, map, share, single, take } from 'rxjs/operators';
import {
  GetSessionResponse,
  CommonMessageResponse,
  SignOutResponse,
  SignUpResponse,
  SignInResponse,
  PutUserPasswordResponse,
  PutUserIconResponse,
  PutUserWallpaperResponse,
  DeleteRecordResponse,
  PutRecordResponse,
  GetRecordResponse,
  PostRecordResponse,
  PutUserPhoneResponse,
  GetVerifySmsCode
} from '../interfaces/responses.interface';
import {
  PlainObject
} from '../interfaces/json-object.interface';
import { UserStoreService } from '../stores/user-store.service';
import { INotification } from '../interfaces/notification.interface';
import { IUserField } from '../interfaces/user-field.interface';
import { USER_RECORDS } from '../enums/all.enums';
import { HttpStatusCode } from '../enums/http-codes.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ClientService {
  session: GetSessionResponse | null = null;
  sessionChecked: boolean = false;

  constructor(
    public http: HttpClient,
    private userStore: UserStoreService,
  ) {
    super(http);
  }

  private isFirstCall = true;

  checkUserSession() {
    return this.userStore.getChangesObs().pipe(
      flatMap((you: IUser | null) => {
        return you !== undefined
          ? of(you)
          : this.checkSession().pipe(
              map((response: GetSessionResponse) => {
                return response.you || null;
              })
            );
      })
    );
  }

  private checkSession() {
    const jwt = window.localStorage.getItem('rmw-modern-apps-jwt');
    if (!jwt) {
      this.userStore.setState(null);
      return of(<GetSessionResponse> {
        error: true,
        status: HttpStatusCode.REQUEST_FAILED,
        message: `no token found`,
        you: null
      });
    }
    return this.sendRequest<GetSessionResponse>(
      '/common/users/check-session',
      `GET`,
      null,
    ).pipe(
      map((response) => {
        this.session = response;
        this.sessionChecked = true;
        this.userStore.setState(response.you);
        return response;
      })
    );
  }

  sign_out() {
    return this.sendRequest<SignOutResponse>('/common/users/sign-out', `GET`, null).pipe(
      map((response) => {
        this.userStore.setState(null);
        window.localStorage.removeItem('rmw-modern-apps-jwt');
        return response;
      })
    );
  }

  verify_email(uuid: string): Observable<CommonMessageResponse> {
    const endpoint = '/common/users/verify-email/' + uuid;
    return this.sendRequest<CommonMessageResponse>(endpoint, `GET`).pipe(
      map((response) => {
        this.userStore.setState(null);
        window.localStorage.removeItem('rmw-modern-apps-jwt');
        return response;
      })
    );
  }

  send_sms_verification(phone: string): Observable<CommonMessageResponse> {
    const endpoint = '/common/users/send-sms-verification/' + phone;
    return this.sendRequest<CommonMessageResponse>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verify_sms_code(params: {
    request_id: string,
    code: string,
    shouldSetUserSession?: boolean
  }): Observable<GetVerifySmsCode> {
    const { request_id, code, shouldSetUserSession } = params;
    const queryParams = shouldSetUserSession
      ? '?setUserSession=true'
      : '';
    const endpoint = `/common/users/verify-sms-code/request_id/${request_id}/code/${code}${queryParams}`;
    return this.sendRequest<GetVerifySmsCode>(endpoint, `GET`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  send_feedback(you_id: number, data: PlainObject) {
    const endpoint = `/common/users/${you_id}/feedback`;
    return this.sendRequest<PostRecordResponse<any>>(endpoint, `POST`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** */

  get_user_by_id(id: number) {
    const endpoint = '/common/users/id/' + id;
    return this.sendRequest<{ user: IUser }>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_by_phone(phone: string) {
    const endpoint = '/common/users/phone/' + phone;
    return this.sendRequest<{ user: IUser }>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_follows(you_id: number, user_id: number) {
    const endpoint = `/common/users/${you_id}/follows/${user_id}`;
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followers_count(user_id: number) {
    const endpoint = `/common/users/${user_id}/followers-count`;
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_followings_count(user_id: number) {
    const endpoint = `/common/users/${user_id}/followings-count`;
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
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
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_messages(you_id: number, user_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/common/users/' + you_id + '/messages/' + user_id + '/' + min_id
      : '/common/users/' + you_id + '/messages/' + user_id;
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_unseen_counts(you_id: number) {
    const endpoint = `/common/users/${you_id}/unseen-counts`;
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // generic

  get_user_records<T>(id: number, minId: number, path: USER_RECORDS, get_all: boolean = false, is_public: boolean = true) {
    const partial_prefix = is_public ? '/get-' : '/';
    const endpoint = get_all
      ? '/common/users/' + id + `${partial_prefix}` + path + '/all'
      : minId
        ? '/common/users/' + id + `${partial_prefix}` + path + '/' + minId
        : '/common/users/' + id + `${partial_prefix}` + path;
    return this.sendRequest<GetRecordResponse<T[]>>(endpoint, `GET`).pipe(
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
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_feed(you_id: number, feed_type: string, min_id?: number) {
    const endpoint = min_id
      ? `/common/users/${you_id}/feed/${min_id}?feed_type=${feed_type}`
      : `/common/users/${you_id}/feed?feed_type=${feed_type}`;
    return this.sendRequest<GetRecordResponse<any>>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /** POST */

  sign_up(data: PlainObject) {
    return this.sendRequest<SignUpResponse>('/common/users', `POST`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.setState(response.you);
        return response;
      })
    );
  }

  create_user_field(id: number, data: PlainObject) {
    return this.sendRequest<PostRecordResponse<IUserField>>(`/common/users/${id}/user-field`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  follow_user(you_id: number, user_id: number) {
    const endpoint = `/common/users/${you_id}/follows/${user_id}`;
    return this.sendRequest<PostRecordResponse<any>>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  send_user_message(you_id: number, user_id: number, data: PlainObject) {
    return this.sendRequest<PostRecordResponse<any>>(`/common/users/${you_id}/send-message/${user_id}`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_user_last_opened(you_id: number) {
    return this.sendRequest<PostRecordResponse<any>>(`/common/users/${you_id}/notifications/update-last-opened`, `POST`).pipe(
      map((response: any) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.setState(response.you);
        return response;
      })
    );
  }

  update_conversation_last_opened(you_id: number, conversation_id: number) {
    return this.sendRequest<PostRecordResponse<any>>(`/common/users/${you_id}/conversations/${conversation_id}/update-last-opened`, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /** PUT */

  sign_in(data: PlainObject) {
    return this.sendRequest<SignInResponse>('/common/users', `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.setState(response.you);
        return response;
      })
    );
  }

  update_info(id: number, data: PlainObject) {
    const endpoint = `/common/users/${id}/info`;
    return this.sendRequest<PutRecordResponse<IUser>>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.mergeState(response.data);
        return response;
      })
    );
  }

  update_password(id: number, data: PlainObject) {
    const endpoint = `/common/users/${id}/password`;
    return this.sendRequest<PutRecordResponse<IUser>>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.mergeState(response.data);
        return response;
      })
    );
  }

  update_phone(id: number, data: PlainObject) {
    const endpoint = `/common/users/${id}/phone`;
    return this.sendRequest<PutRecordResponse<IUser>>(endpoint, `PUT`, data).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.mergeState(response.data);
        return response;
      })
    );
  }

  update_icon(id: number, formData: FormData) {
    const endpoint = `/common/users/${id}/icon`;
    return this.sendRequest<PutRecordResponse<IUser>>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.mergeState(response.data);
        return response;
      })
    );
  }

  update_wallpaper(id: number, formData: FormData) {
    const endpoint = `/common/users/${id}/wallpaper`;
    return this.sendRequest<PutRecordResponse<IUser>>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        window.localStorage.setItem('rmw-modern-apps-jwt', response.token);
        this.userStore.mergeState(response.data);
        return response;
      })
    );
  }

  update_user_field(you_id: number, id: number, data: PlainObject) {
    return this.sendRequest<PutRecordResponse<IUserField>>(`/common/users/${you_id}/user-field/${id}`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /** DELETE */

  delete_user_field(you_id: number, id: number) {
    return this.sendRequest<DeleteRecordResponse>(`/common/users/${you_id}/user-field/${id}`, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  unfollow_user(you_id: number, user_id: number) {
    const endpoint = `/common/users/${you_id}/follows/${user_id}`;
    return this.sendRequest<DeleteRecordResponse>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}