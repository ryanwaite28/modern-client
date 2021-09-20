import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { ResolveType } from "projects/_common/src/app/guards/_guard";
import { map } from "rxjs/operators";
import { DeliveryService } from "../services/delivery.service";

@Injectable({
  providedIn: 'root'
})
export class DeliveryResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private deliveryService: DeliveryService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<any> {
    // console.log({ state, route });
    return this.deliveryService.get_delivery_by_id(route.params.delivery_id).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}