import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'myfavors-favor-search',
  templateUrl: './favor-search.component.html',
  styleUrls: ['./favor-search.component.scss']
})
export class MyfavorsUserFavorSearchFragmentComponent implements OnInit {
  @ViewChild('locationInput') locationInput: ElementRef<HTMLInputElement> | any;
  
  you: any;
  loading: boolean = false;
  firstSearch: boolean = true;
  search_favors_results: any = [];
  searchFavorsForm = new FormGroup({
    city: new FormControl('', []),
    state: new FormControl('', []),
  });

  google: any;
  googleSub: Subscription | any;
  map: any;
  locationInputAutocomplete: any;
  placeData: any = {};
  searchError = '';

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private favorsService: FavorsService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
    });
  }
  
  ngAfterViewInit() {
    this.googleSub = this.googleMapsService.isReady().subscribe(
      (google) => {
        if (google) {
          this.google = google;
          this.initGoogleAutoComplete(google);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initGoogleAutoComplete(google: any) {
    this.locationInputAutocomplete = new google.maps.places.Autocomplete(this.locationInput?.nativeElement);

    this.setAutocompleteCallback(google, this.locationInputAutocomplete, this.placeData, () => {
      this.searchFavorsForm.get('city')!.setValue(this.placeData.city);
      this.searchFavorsForm.get('state')!.setValue(this.placeData.state);
      this.searchFavorsForm.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    });
  }

  setAutocompleteCallback(
    google: any,
    autocomplete: any,
    placeData: any,
    cb?: () => any
  ) {
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      // reset
      Object.keys(placeData).forEach((key) => {
        placeData[key] = undefined;
      });
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (this.googleMapsService.componentForm[addressType]) {
          var val = place.address_components[i][this.googleMapsService.componentForm[addressType]];
          placeData[this.googleMapsService.switchName(addressType)] = val;
        }
      }
      if(!placeData['city']) {
        placeData['city'] = '';
      }
      if(!placeData['state']) {
        placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = placeData;
      const location = `${place.name ? (place.name + ' - ') : ''}${street_number ? (street_number + ' ') : ''}${route ? (route + ', ') : ''}${city ? (city + ', ') : ''}${state || ''}${zipcode ? (' ' + zipcode + ', ') : ', '}${country ? (country + ' ') : ''}`.trim().replace(/[\s]{2,}/, ' ');
      
      placeData.location = location;
      placeData.address = place.formatted_address;
      placeData.lat = place.geometry.location.lat();
      placeData.lng = place.geometry.location.lng();
      placeData.place_id = place.place_id;

      if (cb) {
        cb();
      }
    });
  }

  onSubmitSearchFavorsForm() {
    this.loading = true;
    if (this.firstSearch) {
      this.firstSearch = false;
    }
    this.favorsService.searchFavors(this.searchFavorsForm.value).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.searchError = '';
        this.search_favors_results = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.searchError = error.error.message;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  assignFavor(favor: any) {
    const ask = window.confirm(`Are you sure you want to help with this favor?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.assignFavor<any>(this.you!.id, favor.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.handleResponseSuccessGeneric(response);
        this.router.navigate(['/', 'modern', 'apps', 'myfavors', 'users', this.you!.id, 'favor-helpings']);
      },
      error: (error: any) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
