import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertTypes } from 'projects/_common/src/app/enums/all.enums';
import { PlainObject } from 'projects/_common/src/app/interfaces/json-object.interface';
import { IUserField } from 'projects/_common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { ClientService } from 'projects/_common/src/app/services/client.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { capitalize } from 'projects/_common/src/app/_misc/chamber';
import { Subscription } from 'rxjs';

@Component({
  selector: 'common-user-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class CommonUserSettingsFragmentComponent implements OnInit {
  you: IUser | null = null;
  loading: boolean = false;
  initState = false;
  infoData: PlainObject = {};
  locationInfo: PlainObject = {};
  loadingPath = '';

  cityQuery?: string;
  zipcodeQuery?: string;
  placeData: PlainObject = {};
  componentForm: PlainObject = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  verification_requested_successfully: boolean = false;
  sms_request_id?: string;
  phone_is_verified: boolean = false;
  
  // forms

  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  TEXT_INV_PRT_LIMIT = 500;

  userInfoForm = new FormGroup({
    email: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    username: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    displayname: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    // city: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    // state: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    // zipcode: new FormControl(0, [Validators.maxLength(5)]),
    // country: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    location: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    location_id: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    location_json: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    bio: new FormControl('', [Validators.maxLength(this.TEXT_FORM_LIMIT)]),
    headline: new FormControl('', [Validators.maxLength(75)]),
    // tags: new FormControl([], [Validators.maxLength(20)]),
    can_message: new FormControl(false, []),
    can_converse: new FormControl(false, []),
  });

  userPasswordForm = new FormGroup({
    oldPassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    password: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    confirmPassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
  });

  phoneForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
  });
  phoneVerifyForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
  });

  userIconForm = new FormGroup({
    file: new FormControl(null),
  });

  userWallpaperForm = new FormGroup({
    file: new FormControl(null),
  });

  locationInput?: HTMLInputElement;
  googleIsReadySub?: Subscription;
  autocomplete?: any;
  manage: PlainObject = {};

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private alertService: AlertService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleMapsService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      this.setFormsInitialState();
    });
  }

  ngAfterViewInit() {
    this.locationInput = <HTMLInputElement> window.document.getElementById('location-input');
    console.log('location-input', this.locationInput);
    this.googleIsReadySub = this.googleService.isReady().subscribe(
      (google) => {
        if (google) {
          if (this.googleIsReadySub) {
            this.googleIsReadySub.unsubscribe();
          }
          this.initGoogle(google);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initGoogle(google: any) {
    if (this.autocomplete) {
      return;
    }
    console.log(`initializing autocomplete`);
    this.autocomplete = new google.maps.places.Autocomplete(this.locationInput);
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      var place = this.autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      
      this.manage.place = place;
      this.manage.formatted_address = place.formatted_address;
      this.manage.latitude = place.geometry.location.lat();
      this.manage.longitude = place.geometry.location.lng();

      
      this.placeData = {};
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          var val = place.address_components[i][this.componentForm[addressType]];
          this.placeData[this.switchName(addressType)] = val;
          var elm = document.getElementById(addressType);
          if (elm) { (<any> elm).value = val; };
        }
      }
      if(!this.placeData['city']) {
        this.placeData['city'] = '';
      }
      if(!this.placeData['state']) {
        this.placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = this.placeData;
      const location = `${street_number} ${route}, ${city}, ${state} ${zipcode}, ${country}`.trim();
      this.placeData.location = location;
      this.placeData.address = this.manage.formatted_address;
      this.placeData.lat = this.manage.latitude;
      this.placeData.lng = this.manage.longitude;

      console.log(this.placeData, place, JSON.stringify(place));
    });
  }

  switchName(name: string) {
    switch(name) {
      case 'locality':
        return 'city';
      case 'administrative_area_level_1':
        return 'state';
      case 'country':
        return 'country';
      case 'postal_code':
        return 'zipcode';

      default:
        return name;
    }
  }

  setFormsInitialState() {
    if (this.you && !this.initState) {
      this.initState = true;
      this.cityQuery = this.you.city;
      this.zipcodeQuery = this.you.zipcode;

      this.userInfoForm.setValue({
        email: this.you.email,
        username: this.you.username,
        displayname: this.you.displayname,
        // city: this.you.city,
        // state: this.you.state,
        // zipcode: this.you.zipcode,
        // country: this.you.country,
        // tags: this.you.tags ? this.you.tags.split(',') : [],
        location: this.you.location,
        location_id: this.you.location_id,
        location_json: this.you.location_json,
        bio: this.you.bio,
        headline: this.you.headline,
        can_message: this.you.can_message,
        can_converse: this.you.can_converse,
      });
    }
  }

  handleResponseSuccess(response: { message: string }) {
    this.alertService.addAlert({
      type: AlertTypes.SUCCESS,
      message: response.message
    }, true);
  }

  handleResponseError(error: HttpErrorResponse) {
    this.alertService.addAlert({
      type: AlertTypes.DANGER,
      message: error.error.message
    }, true);
    this.loading = false;
  }

  /** on submit methods */

  onSubmitUserInfoForm() {
    const data = {
      ...this.userInfoForm.value,
      ...this.phoneForm.value,
      ...this.placeData,
    };
    if (this.manage.place) {
      data.location = this.manage.place.formatted_address;
      data.location_id = this.manage.place.place_id;
      data.location_json = JSON.stringify(this.manage.place);
    }
    this.loading = true;
    this.userService.update_info(this.you!.id, data)
      .subscribe(
        (response) => {
          this.handleResponseSuccess(response);
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserPasswordForm() {
    this.loading = true;
    this.userService.update_password(this.you!.id, this.userPasswordForm.value)
      .subscribe(
        (response) => {
          this.handleResponseSuccess(response);
          this.userPasswordForm.reset({
            oldPassword: '',
            password: '',
            confirmPassword: '',
          });
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserIconForm(
    userIconFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    // console.log({ userIconFormElm, fileInput });
    const formData = new FormData(userIconFormElm);
    const file = !!fileInput && !!fileInput.files && fileInput.files[0];
    if (!file) {
      const ask = window.confirm(
        `No file was found. Do you want to clear your icon?`
      );
      if (!ask) {
        return;
      }
    }
    formData.append('should_delete', 'true');
    this.loading = true;
    this.userService.update_icon(this.you!.id, formData)
      .subscribe(
        (response) => {
          this.handleResponseSuccess(response);
          this.userIconForm.reset();
          if (fileInput) {
            fileInput.value = '';
          }
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  onSubmitUserWallpaperForm(
    userWallpaperFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    // console.log({ userWallpaperFormElm, fileInput });
    const formData = new FormData(userWallpaperFormElm);
    const file = !!fileInput && !!fileInput.files && fileInput.files[0];
    if (!file) {
      const ask = window.confirm(
        `No file was found. Do you want to clear your wallpaper?`
      );
      if (!ask) {
        return;
      }
    }
    formData.append('should_delete', 'true');
    this.loading = true;
    this.userService.update_wallpaper(this.you!.id, formData)
      .subscribe(
        (response) => {
          this.handleResponseSuccess(response);
          this.userWallpaperForm.reset();
          if (fileInput) {
            fileInput.value = '';
          }
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  search(event: any, path: string) {
    const query = event.target.value;
    // console.log(query);
    if (!query || this.loading) {
      return;
    }
    this.loading = true;
    this.loadingPath = path;
    this.clientService.sendRequest<PlainObject>(`/info/locations/usa/${path}?query=${query}`, `GET`, null).subscribe((response) => {
      // console.log(response);
      const prop = `usa` + capitalize(path);
      (<any> this)[prop] = response.data;
      this.loading = false;
      this.loadingPath = '';
    });
  }

  send_sms_verification() {
    this.userService.send_sms_verification(`1` + this.phoneForm.value.phone)
      .subscribe(
        (response: any) => {
          this.verification_requested_successfully = true;
          this.sms_request_id = response.sms_request_id;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  verify_sms_code() {
    this.userService.update_phone(this.you!.id, {
      request_id: this.sms_request_id,
      code: this.phoneVerifyForm.value.code,
      phone: this.phoneForm.value.phone
    })
      .subscribe(
        (response: any) => {
          this.phone_is_verified = true;
          this.handleResponseSuccess(response);
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }
}