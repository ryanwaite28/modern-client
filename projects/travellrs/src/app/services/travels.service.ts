import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MODERN_APPS, USER_RECORDS } from 'projects/_common/src/app/enums/all.enums';
import { ClientService } from 'projects/_common/src/app/services/client.service';
import { UsersService } from 'projects/_common/src/app/services/users.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TravelsService {
  private newTravelCreatedStream = new Subject<any>();
  
  constructor(
    private http: HttpClient,
    private userService: UsersService,
    private clientService: ClientService,
  ) {}

  // newTravelCreated() {
  //   return this.newTravelCreatedStream.asObservable();
  // }


  getUserTravelsAll<T = any>(user_id: number) {
    return this.userService.get_user_records(
      user_id,
      MODERN_APPS.TRAVELLRS,
      USER_RECORDS.MARKERS,
      undefined,
      true,
      true
    );
  }

  getUserTravels<T = any>(user_id: number, min_id?: number) {
    return this.userService.get_user_records<T>(
      user_id,
      MODERN_APPS.TRAVELLRS,
      USER_RECORDS.MARKERS,
      min_id,
      false,
      true
    );
  }

  createTravel<T = any>(data: FormData, user_id: number) {
    return this.clientService.sendRequest<T>(`/travellrs/markers/owner/${user_id}`, `POST`, data);
  }
}









// export class TravelsService {
//   /*
//     9/4/2021

//     Trying new approach to object oriented programming (blending functional programming).
//     Instead of doing the typical updating an object's fields 
//     and making app state go out of sync, make services the gold source,
//     meaning services will be where objects are created, fetched, updated, deleted;
//     any action that causes state change is emitted as an event from the service with additional details.
//   */

//   private newTravelCreatedStream = new Subject<any>();
  
//   constructor(
//     public http: HttpClient
//   ) {
//     super(http);
//   }

//   newTravelCreated() {
//     return this.newTravelCreatedStream.asObservable();
//   }

//   createTravel<T = any>(data: FormData) {
//     /*  
//       instead of this method returning the response,
//       it will make the call and emit the result as an event
//       to alloq multiple areas of the app to be notified if/when needed.
//     */
//     this.sendRequest<T>(`/travellrs/`, `POST`, data).subscribe({
//       next: (response: any) => {
//         this.newTravelCreatedStream.next(response);
//       },
//       error: (error) => {
//         this.newTravelCreatedStream.next(error);
//       }
//     });
//   }
// }
