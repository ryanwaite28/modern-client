import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { map } from 'rxjs/operators';
import { CanActivateReturn } from './_guard';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.canActivate(route, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.userService.checkUserSession().pipe(
      map((you) => {
        if (!you) {
          this.router.navigate(['/', 'modern', 'signin']);
        }
        return !!you;
      })
    );
  }
}
