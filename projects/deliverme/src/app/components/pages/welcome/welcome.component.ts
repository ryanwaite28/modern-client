import { Component, OnInit } from '@angular/core';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'deliverme-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class DeliverMeWelcomeComponent implements OnInit {
  you: IUser | null = null;
  loading: boolean = false;

  locationInput: HTMLInputElement | null = null;
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
    this.locationInput = <HTMLInputElement> window.document.getElementById('location-input');
    const googleIsReadySub = this.googleService.isReady().subscribe(
      (google) => {
        if (google) {
          this.initGoogle(google);
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.subscriptionsMap.set('googleIsReadySub', googleIsReadySub);
  }

  initGoogle(google: any) {
    if (!this.locationInput) {
      throw new ReferenceError(`location-input is not defined...`);
    }

    const place_changes_sub = this.googleService.makeTextInputIntoLocationAutoComplete(this.locationInput).subscribe({
      next: (results) => {
        this.locationResults = results;
        console.log(this);
      }
    });
    this.subscriptionsMap.set('place_changes_sub', place_changes_sub);
  }

  searchDeliveries() {
    const canSearch = this.locationResults && !!this.locationInput!.value;
    if (!canSearch) {
      console.log(`cannot search...`);
      return;
    }

    
  }
}
