import { Component, OnInit } from '@angular/core';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs/internal/Subscription';
// import * as world_wallpaper from '../../../../assets/img/world-wallpaper.png';

declare var $: any;



@Component({
  selector: 'travellrs-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class TravellrsWelcomePageComponent implements OnInit {
  you: IUser | any;
  loading: boolean = false;

  locationInput: HTMLInputElement | any;
  subscriptionsMap = new Map<string, Subscription>();
  locationResults: any;
  autoCompleteData: any;

  // wallpaper = world_wallpaper;

  constructor(
    private googleService: GoogleMapsService,
    private userStore: UserStoreService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });

    $(document).ready(function() {
      $('.parallax-window').parallax({ imageSrc: `./assets/img/world-wallpaper.png` });
      $('.parallax-mirror').addClass('sliding').css({ 'z-index': 'unset' });
      // $('.parallax-slider').wrap('<marquee></marquee>');
    });
  }

  ngOnDestroy() {
    Array.from(document.querySelectorAll('.parallax-mirror')).forEach((element) => {
      element.parentElement?.removeChild(element);
    });
    for (const subscription of this.subscriptionsMap.values()) {
      subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.locationInput = <HTMLInputElement> window.document.getElementById('location-input');
    const googleIsReadySub = this.googleService.isReady().subscribe(
      (google) => {
        if (google) {
          // this.initGoogle(google);
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
}
