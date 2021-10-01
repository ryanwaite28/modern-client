import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { ResolveType } from "projects/_common/src/app/guards/_guard";
import { map } from "rxjs/operators";
import { FavorsService } from "../services/favors.service";

@Injectable({
  providedIn: 'root'
})
export class FavorResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private favorsService: FavorsService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<any> {
    // console.log({ state, route });
    return this.favorsService.get_favor_by_id(route.params.favor_id).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}