import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs/operators";
import { ResolveType } from "../guards/_guard";
import { GetSessionResponse } from "../interfaces/responses.interface";
import { IUser } from "../interfaces/user.interface";
import { UsersService } from "../services/users.service";
import { UserStoreService } from "../stores/user-store.service";

@Injectable({
  providedIn: 'root'
})
export class InitialCheckSessionResolver implements Resolve<IUser> {
  constructor(
    private router: Router,
    private userService: UsersService,
    private userStore: UserStoreService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<IUser> {
    return this.userService.checkUserSession().pipe(
      map((response: GetSessionResponse) => {
        // this.userStore.setState(response.data.you);
        return response.data.you;
      })
    );
  }
}