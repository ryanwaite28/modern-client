import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'myfavors-favor-payment-cancel-page',
  templateUrl: './favor-payment-cancel-page.component.html',
  styleUrls: ['./favor-payment-cancel-page.component.scss']
})
export class FavorPaymentCancelPageComponent implements OnInit {
  you: IUser | any;
  favor: any = null;

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
    
    this.route.data.subscribe((data) => {
      this.favor = data.favor;
      console.log(this);
    });
  }

}
