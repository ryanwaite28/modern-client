import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Component({
  selector: 'myfavors-favor-payment-success-page',
  templateUrl: './favor-payment-success-page.component.html',
  styleUrls: ['./favor-payment-success-page.component.scss']
})
export class FavorPaymentSuccessPageComponent implements OnInit {
  you: IUser | any;
  favor: any = null;
  session_id: any = null;

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private favorsService: FavorsService
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });

    this.route.parent!.data
      .pipe(
        flatMap((data) => {
          this.favor = data.favor;
          return this.route.parent!.queryParams;
        }),
        flatMap((params) => {
          this.session_id = params.session_id;
          return of(true);
        })
      )
      .subscribe(() => {
        console.log(this);
      });
  }

}
