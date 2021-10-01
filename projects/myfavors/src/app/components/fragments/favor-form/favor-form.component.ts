import { AfterViewInit, Component, ElementRef, Input, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertTypes } from 'projects/_common/src/app/enums/all.enums';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { StripeService } from 'projects/_common/src/app/services/stripe.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';

const sizes = [
  'X-SMALL',
  'SMALL',
  'MEDIUM',
  'LARGE',
  'X-LARGE',
];

const payout_per_helper_min = 3;

const favor_form_config = [
  { field: 'title', defaultValue: '', validations: [Validators.required, Validators.minLength(10)] },
  { field: 'description', defaultValue: '', validations: [Validators.required, Validators.minLength(10)] },
  { field: 'category', defaultValue: '', validations: [] },

  { field: 'file', defaultValue: null, validations: [] },

  { field: 'payout_per_helper', defaultValue: payout_per_helper_min, validations: [Validators.required, Validators.min(payout_per_helper_min)] },
  { field: 'helpers_wanted', defaultValue: 1, validations: [Validators.required, Validators.min(1)] },
  { field: 'date_needed', defaultValue: '', validations: [] },
  { field: 'time_needed', defaultValue: '', validations: [] },
];

@Component({
  selector: 'myfavors-favor-form',
  templateUrl: './favor-form.component.html',
  styleUrls: ['./favor-form.component.scss']
})
export class FavorFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('favorFormElm') favorFormElm: ElementRef<HTMLFormElement> | any;
  @ViewChild('locationInput') locationInput: ElementRef<HTMLInputElement> | any;

  @Input() you: IUser | any;
  @Input() favor: any;
  @Input() isEditing: boolean = false;
  @Input() loading?: boolean;

  @Output() favorFormSubmit = new EventEmitter<any>();

  google: any;
  googleSub: Subscription | any;
  map: any;
  locationAutocomplete: any;
  placeData: any = {};
  sizes = sizes;
  payout_per_helper_min = payout_per_helper_min;
  acknowledgement_checked = false;

  favorForm: FormGroup;

  chargeFeeData: any;

  constructor(
    private userStore: UserStoreService,
    private stripeService: StripeService,
    private alertService: AlertService,
    private googleMapsService: GoogleMapsService,
  ) {
    const formGroupConfig: { [key:string]: FormControl } = {};
    for (const config of favor_form_config) {
      formGroupConfig[config.field] = new FormControl(config.defaultValue, config.validations)
    }
    this.favorForm = new FormGroup(formGroupConfig);

    const { payout_per_helper, helpers_wanted } = this.favorForm.value;
    const bothHasValud = payout_per_helper > 0 && helpers_wanted > 0;
    if (bothHasValud) {
      const useAmount = payout_per_helper * helpers_wanted;
      this.chargeFeeData = this.stripeService.add_on_stripe_processing_fee(useAmount);
    }

    this.favorForm.get('payout_per_helper')!.valueChanges.subscribe((payout_per_helper) => {
      const { helpers_wanted } = this.favorForm.value;
      const bothHasValud = payout_per_helper > 0 && helpers_wanted > 0;
      if (bothHasValud) {
        const useAmount = payout_per_helper * helpers_wanted;
        this.chargeFeeData = this.stripeService.add_on_stripe_processing_fee(useAmount);
      }
    });
    this.favorForm.get('helpers_wanted')!.valueChanges.subscribe((helpers_wanted) => {
      const { payout_per_helper } = this.favorForm.value;
      const bothHasValud = payout_per_helper > 0 && helpers_wanted > 0;
      if (bothHasValud) {
        const useAmount = payout_per_helper * helpers_wanted;
        this.chargeFeeData = this.stripeService.add_on_stripe_processing_fee(useAmount);
      }
    });
  }

  ngAfterViewInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
      const shouldUpdateForm = this.isEditing && this.favor && this.favorForm;
      if (shouldUpdateForm) {
        // this.favorForm.setValue({
        //   title: this.favor.title,
        //   description: this.favor.description,
        //   category: this.favor.category,

        //   file: null,
  
        //   size: this.sizes[1],
        //   weight: 0,
        //   payout: 0,
        //   penalty: 0,
        // });
      }
    });

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

  ngOnDestroy() {
    this.googleSub?.unsubscribe();
  }

  initGoogleAutoComplete(google: any) {
    this.locationAutocomplete = new google.maps.places.Autocomplete(this.locationInput?.nativeElement);

    this.setAutocompleteCallback(google, this.locationAutocomplete, this.placeData);
  }

  setAutocompleteCallback(
    google: any,
    autocomplete: any,
    placeData: any,
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

      console.log(place, this);
    });
  }

  resetForm(
    favorFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    if (!this.isEditing) {
      if (fileInput) {
        fileInput.value = '';
      }

      const defaultFormValue: { [key:string]: any } = {};
      for (const config of favor_form_config) {
        defaultFormValue[config.field] = config.defaultValue;
      }
      this.favorForm.reset(defaultFormValue);

      for (const key of Object.keys(this.placeData)) {
        delete this.placeData[key];
      }

      this.locationInput!.nativeElement.value = '';
      this.acknowledgement_checked = false;
    }
  }

  onSubmitFavor(
    favorFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    if (!this.isEditing && !this.placeData.lat) {
      return this.alertService.addAlert({
        type: AlertTypes.DANGER,
        message: `Location is required`
      }, true);
    }

    const formData = new FormData(favorFormElm);
    const payload = {
      ...this.favorForm!.value,

      location: this.placeData.location,
      address: this.placeData.address,
      street: this.placeData.street_number,
      city: this.placeData.city,
      state: this.placeData.state,
      zipcode: this.placeData.zipcode,
      country: this.placeData.country,
      place_id: this.placeData.place_id,
      lat: this.placeData.lat,
      lng: this.placeData.lng,

      file: undefined,
    };
    formData.append(`payload`, JSON.stringify(payload));
    console.log(favorFormElm, this);

    this.favorFormSubmit.emit({
      formElm: favorFormElm,
      form: this.favorForm,
      formData,
      payload,
      fileInput,
      resetForm: () => {
        this.resetForm(favorFormElm, fileInput);
      }
    });
  }
}