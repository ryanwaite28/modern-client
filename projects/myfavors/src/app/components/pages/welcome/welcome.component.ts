import { Component, OnInit } from '@angular/core';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'myfavors-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class MyfavorsWelcomeComponent implements OnInit {
  you: IUser | any;
  loading: boolean = false;

  locationInput: HTMLInputElement | any;
  subscriptionsMap = new Map<string, Subscription>();
  locationResults: any;
  autoCompleteData: any;

  constructor(
    private googleService: GoogleMapsService,
    private userStore: UserStoreService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsMap.values()) {
      subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
  }
}