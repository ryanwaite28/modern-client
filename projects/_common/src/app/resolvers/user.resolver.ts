import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs/operators";
import { ResolveType } from "../guards/_guard";
import { GetSessionResponse } from "../interfaces/responses.interface";
import { IUser } from "../interfaces/user.interface";
import { UserService } from "../services/user.service";
import { UserStoreService } from "../stores/user-store.service";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<IUser> {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private userStore: UserStoreService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<IUser> {
    // console.log({ state, route });
    return this.userService.get_user_by_id(route.params.user_id).pipe(
      map((response) => {
        return response.user;
      })
    )
  }
}