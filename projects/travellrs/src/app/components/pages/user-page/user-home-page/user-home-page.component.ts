import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TravelsService } from 'projects/travellrs/src/app/services/travels.service';
import { PlainObject } from 'projects/_common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'travellrs-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class TravellrsUserHomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapsDiv') mapsDiv: ElementRef<HTMLDivElement> | any;
  @ViewChild('pacInput') pacInput: ElementRef<HTMLInputElement> | any;
  
  loading: boolean = false;
  you: IUser | any;
  selectedPlace: any;
  google: any;
  googleSub: Subscription | any;
  placeData: PlainObject = {};
  manage: any = {
    map: null,
    marker: null,
    infowindow: null,
    input: null,
    autocomplete: null,
  };

  TEXT_FORM_LIMIT = 250;
  newMarkerForm = new FormGroup({
    caption: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    date_traveled: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    time_traveled: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    file: new FormControl(null),
  });

  constructor(
    private userStore: UserStoreService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private travelsService: TravelsService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });
  }

  ngOnDestroy(): void {
    this.googleSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.googleSub = this.googleMapsService.isReady().pipe(take(2)).subscribe((google) => {
      this.google = google;
      if (google) {
        this.initMap();
      }
    });
  }

  initMap() {
    const google = this.google;
    const manage = this.manage;

    manage.map = new google.maps.Map(this.mapsDiv?.nativeElement, {
      center: {
        lat: 39.173303,
        lng: -77.177274
      },
      scrollwheel: true,
      zoom: 5
    });
    manage.input = this.pacInput?.nativeElement;
    manage.marker = new google.maps.Marker({
      map: manage.map,
    });
    manage.marker.clearLocation = () => {
      manage.marker.place_id = false;
      manage.marker.location = false;
      manage.marker.latitude = false;
      manage.marker.longitude = false;
      this.selectedPlace = null;
      console.log("location cleared");
    }

    manage.infowindow = new google.maps.InfoWindow();
    manage.autocomplete = new google.maps.places.Autocomplete(manage.input);
    manage.autocomplete.bindTo('bounds', manage.map);
    manage.map.controls[google.maps.ControlPosition.TOP_LEFT].push(manage.input);

    google.maps.event.addListener(manage.autocomplete, 'place_changed', () => {
      manage.infowindow.close();
      var place = manage.autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        manage.map.fitBounds(place.geometry.viewport);
      } else {
        manage.map.setCenter(place.geometry.location);
        manage.map.setZoom(17);
      }

      var placeName = place.name + ' | ' + place.formatted_address;

      manage.marker.place_id = place.place_id;
      manage.marker.location = placeName;
      manage.marker.latitude = place.geometry.location.lat();
      manage.marker.longitude = place.geometry.location.lng();

      this.placeData = {};
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (this.googleMapsService.componentForm[addressType]) {
          var val = place.address_components[i][this.googleMapsService.componentForm[addressType]];
          this.placeData[this.googleMapsService.switchName(addressType)] = val;
        }
      }
      if(!this.placeData['city']) {
        this.placeData['city'] = '';
      }
      if(!this.placeData['state']) {
        this.placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = this.placeData;
      const location =
        `${place.name ? (place.name + ' - ') : ''}${street_number ? (street_number + ' ') : ''}${route ? (route + ', ') : ''}${city ? (city + ', ') : ''}${state || ''}${zipcode ? (' ' + zipcode + ', ') : ', '}${country ? (country + ' ') : ''}`.trim().replace(/[\s]{2,}/, ' ');
      this.placeData.location = location;
      this.placeData.address = this.manage.formatted_address;
      this.placeData.lat = this.manage.marker.latitude;
      this.placeData.lng = this.manage.marker.longitude;
      this.placeData.place_id = this.manage.marker.place_id;

      this.selectedPlace = location;
      this.changeDetectorRef.detectChanges();

      // Set the position of the marker using the place ID and location.
      manage.marker.setPlace( /** @type {!google.maps.Place} */ ({
        placeId: place.place_id,
        location: place.geometry.location
      }));
      manage.marker.setVisible(true);

      manage.infowindow.setContent(
        `<div>
          <strong>${place.name}</strong><br/>
          Place ID: ${place.place_id}<br/>
          ${place.formatted_address}
        </div>`
      );

      manage.infowindow.open(manage.map, manage.marker);
    });
  }

  onSubmitNewMarker(
    newMarkerFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    
    const formData = new FormData(newMarkerFormElm);
    const payload = {
      ...this.placeData,
      caption: this.newMarkerForm.value.caption,
      date_traveled: this.newMarkerForm.value.date_traveled,
      time_traveled: this.newMarkerForm.value.time_traveled,
    };
    formData.append(`payload`, JSON.stringify(payload));
    this.loading = true;
    this.changeDetectorRef.detectChanges();

    this.travelsService.createTravel(formData, this.you!.id).subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.newMarkerForm.reset();
        if (fileInput) {
          fileInput.value = '';
        }
        this.selectedPlace = null;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
