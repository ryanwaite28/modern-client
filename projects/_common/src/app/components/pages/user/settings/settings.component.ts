import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertTypes } from 'projects/_common/src/app/enums/all.enums';
import { PlainObject } from 'projects/_common/src/app/interfaces/json-object.interface';
import { IUserField } from 'projects/_common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { IApiKey, ServiceMethodResultsInfo } from 'projects/_common/src/app/interfaces/_common.interface';
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
  you: IUser | any;
  loading: boolean = false;
  initState = false;
  infoData: PlainObject = {};
  locationInfo: PlainObject = {};
  loadingPath = '';
  apiKey: IApiKey | undefined;
  cityQuery?: string;
  zipcodeQuery?: string;
  placeData: PlainObject = {};

  verification_requested_successfully: boolean = false;
  sms_request_id?: string;
  sms_results: any;
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
    // phone: new FormControl('', [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{10,11}$/g)]),
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
    phone: new FormControl('', [Validators.pattern(/^[\d]+$/), Validators.minLength(10), Validators.maxLength(10)]),
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
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.initSettings(you);
      }
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

  initSettings(you: IUser | null) {
    this.you = you;
    this.setFormsInitialState();

    if (you) {
      this.userService.get_user_api_key(you.id).subscribe({
        next: (response: ServiceMethodResultsInfo<IApiKey>) => {
          this.apiKey = response.data;
        }
      });
    }
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
        if (this.googleService.componentForm[addressType]) {
          var val = place.address_components[i][this.googleService.componentForm[addressType]];
          this.placeData[this.googleService.switchName(addressType)] = val;
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

  setFormsInitialState() {
    if (this.you && !this.initState) {
      this.initState = true;
      this.cityQuery = this.you.city;
      this.zipcodeQuery = this.you.zipcode;

      this.userInfoForm.setValue({
        email: this.you.email,
        // phone: this.you.phone,
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

  handleResponseSuccess(response: { message?: string }) {
    if (!response.message) {
      return;
    }
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

      phone_is_verified: this.phone_is_verified,
      sms_results: this.sms_results,
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
          this.loading = false;
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
          this.loading = false;
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
          this.loading = false;
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
          this.loading = false;
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
    const phone = this.phoneForm.value.phone 
      ? `1` + this.phoneForm.value.phone
      : 'x';

    this.loading = true;
    if (phone === 'x') {
      const ask = window.confirm(`The phone input was blank. Remove phone from your account?`);
      if (!ask) {
        return;
      }
      this.userService.send_sms_verification(phone)
        .subscribe(
          (response: any) => {
            this.loading = false;
            window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
            this.userStore.setState(response.data.you);
            this.verification_requested_successfully = false;
            this.sms_results = undefined;
            this.sms_request_id = undefined;
          },
          (error: HttpErrorResponse) => {
            this.loading = false;
            this.handleResponseError(error);
          }
        );
      return;
    }

    this.userService.send_sms_verification(phone)
      .subscribe(
        (response: any) => {
          this.verification_requested_successfully = true;
          this.sms_results = response.sms_results;
          this.sms_request_id = response.sms_request_id;
        },
        (error: HttpErrorResponse) => {
          this.handleResponseError(error);
        }
      );
  }

  verify_sms_code() {
    this.loading = true;
    this.userService.verify_sms_code({
      request_id: this.sms_request_id!,
      code: this.phoneVerifyForm.value.code,
    }).subscribe(
      (response: any) => {
        this.loading = false;
        this.phone_is_verified = true;
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        this.handleResponseSuccess(response);
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.handleResponseError(error);
      }
    );
  }

  createStripeAccount() {
    this.loading = true;
    this.userService.create_stripe_account(this.you!.id).subscribe(
      (response: any) => {
        this.loading = false;
        window.open(response.onboarding_url, `_blank`);
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.handleResponseError(error);
      }
    );
  }
}
