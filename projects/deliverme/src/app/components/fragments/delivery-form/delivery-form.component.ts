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

const payout_min = 5;

const delivery_form_config = [
  { field: 'title', defaultValue: '', validations: [Validators.required, Validators.minLength(10)] },
  { field: 'description', defaultValue: '', validations: [Validators.required, Validators.minLength(10)] },
  { field: 'file', defaultValue: null, validations: [] },

  { field: 'from_person', defaultValue: '', validations: [Validators.required] },
  { field: 'from_person_phone', defaultValue: '', validations: [] },
  { field: 'from_person_email', defaultValue: '', validations: [] },
  { field: 'from_person_id_required', defaultValue: false, validations: [] },
  { field: 'from_person_sig_required', defaultValue: false, validations: [] },

  { field: 'to_person', defaultValue: '', validations: [Validators.required] },
  { field: 'to_person_phone', defaultValue: '', validations: [] },
  { field: 'to_person_email', defaultValue: '', validations: [] },
  { field: 'to_person_id_required', defaultValue: false, validations: [] },
  { field: 'to_person_sig_required', defaultValue: false, validations: [] },

  { field: 'size', defaultValue: sizes[1], validations: [Validators.required] },
  { field: 'weight', defaultValue: 0, validations: [Validators.required, Validators.min(0)] },
  { field: 'payout', defaultValue: 0, validations: [Validators.required, Validators.min(payout_min)] },
  { field: 'penalty', defaultValue: 0, validations: [Validators.required, Validators.min(0)] },
  { field: 'auto_accept_anyone', defaultValue: true, validations: [] },
  { field: 'urgent', defaultValue: false, validations: [] },
];

@Component({
  selector: 'deliverme-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.scss']
})
export class DeliveryFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('deliveryFormElm') deliveryFormElm: ElementRef<HTMLFormElement> | any;
  @ViewChild('fromLocationInput') fromLocationInput: ElementRef<HTMLInputElement> | any;
  @ViewChild('toLocationInput') toLocationInput: ElementRef<HTMLInputElement> | any;

  @Input() you: IUser | any;
  @Input() delivery: any;
  @Input() isEditing: boolean = false;
  @Input() loading?: boolean;

  @Output() deliveryFormSubmit = new EventEmitter<any>();

  google: any;
  googleSub: Subscription | any;
  map: any;
  fromAutocomplete: any;
  toAutocomplete: any;
  fromPlaceData: any = {};
  toPlaceData: any = {};
  sizes = sizes;
  payout_min = payout_min;
  acknowledgement_checked = false;

  deliveryForm: FormGroup;

  chargeFeeData: any;

  constructor(
    private userStore: UserStoreService,
    private stripeService: StripeService,
    private alertService: AlertService,
    private googleMapsService: GoogleMapsService,
  ) {
    const formGroupConfig: { [key:string]: FormControl } = {};
    for (const config of delivery_form_config) {
      formGroupConfig[config.field] = new FormControl(config.defaultValue, config.validations)
    }
    this.deliveryForm = new FormGroup(formGroupConfig);
    this.deliveryForm.get('payout')?.valueChanges.subscribe((value) => {
      if (value) {
        this.chargeFeeData = this.stripeService.add_on_stripe_processing_fee(value);
      }
    });
  }

  ngAfterViewInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
      const shouldUpdateForm = this.isEditing && this.delivery && this.deliveryForm;
      if (shouldUpdateForm) {
        this.deliveryForm.setValue({
          title: this.delivery.title,
          description: this.delivery.description,
          file: null,
  
          from_person: this.delivery.from_person,
          from_person_id_required: false,
          from_person_sig_required: false,
  
          to_person: '',
          to_person_id_required: false,
          to_person_sig_required: false,
  
          size: this.sizes[1],
          weight: 0,
          payout: 0,
          penalty: 0,
          auto_accept_anyone: true,
          urgent: false,
        });
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
    this.fromAutocomplete = new google.maps.places.Autocomplete(this.fromLocationInput?.nativeElement);
    this.toAutocomplete = new google.maps.places.Autocomplete(this.toLocationInput?.nativeElement);

    this.setAutocompleteCallback(google, this.fromAutocomplete, this.fromPlaceData);
    this.setAutocompleteCallback(google, this.toAutocomplete, this.toPlaceData);
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
    deliveryFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    if (!this.isEditing) {
      if (fileInput) {
        fileInput.value = '';
      }

      const defaultFormValue: { [key:string]: any } = {};
      for (const config of delivery_form_config) {
        defaultFormValue[config.field] = config.defaultValue;
      }
      this.deliveryForm.reset(defaultFormValue);
      // for (const control in this.deliveryForm.controls) {
      //   this.deliveryForm.get(control)?.markAsPristine();
      //   this.deliveryForm.get(control)?.clearValidators();
      //   this.deliveryForm.get(control)?.updateValueAndValidity();
      // }

      for (const key of Object.keys(this.fromPlaceData)) {
        delete this.fromPlaceData[key];
        delete this.toPlaceData[key];
      }

      this.fromLocationInput!.nativeElement.value = '';
      this.toLocationInput!.nativeElement.value = '';
      this.acknowledgement_checked = false;
    }
  }

  onSubmitDelivery(
    deliveryFormElm: HTMLFormElement,
    fileInput: HTMLInputElement
  ) {
    if (!this.isEditing && !this.fromPlaceData.lat) {
      return this.alertService.addAlert({
        type: AlertTypes.DANGER,
        message: `From Location is required`
      }, true);
    }
    if (!this.isEditing && !this.toPlaceData.lat) {
      return this.alertService.addAlert({
        type: AlertTypes.DANGER,
        message: `To Location is required`
      }, true);
    }

    const distance = this.googleMapsService.get_distance_spherical_api({
      from_lat: this.fromPlaceData.lat,
      from_lng: this.fromPlaceData.lng,
      to_lat: this.toPlaceData.lat,
      to_lng: this.toPlaceData.lng,
    });

    const formData = new FormData(deliveryFormElm);
    const payload = {
      ...this.deliveryForm!.value,

      from_location: this.fromPlaceData.location,
      from_address: this.fromPlaceData.address,
      from_street: this.fromPlaceData.street_number,
      from_city: this.fromPlaceData.city,
      from_state: this.fromPlaceData.state,
      from_zipcode: this.fromPlaceData.zipcode,
      from_country: this.fromPlaceData.country,
      from_place_id: this.fromPlaceData.place_id,
      from_lat: this.fromPlaceData.lat,
      from_lng: this.fromPlaceData.lng,

      to_location: this.toPlaceData.location,
      to_address: this.toPlaceData.address,
      to_street: this.toPlaceData.street_number,
      to_city: this.toPlaceData.city,
      to_state: this.toPlaceData.state,
      to_zipcode: this.toPlaceData.zipcode,
      to_country: this.toPlaceData.country,
      to_place_id: this.toPlaceData.place_id,
      to_lat: this.toPlaceData.lat,
      to_lng: this.toPlaceData.lng,

      distance_miles: distance,

      file: undefined,
    };
    formData.append(`payload`, JSON.stringify(payload));
    console.log(deliveryFormElm, this);

    this.deliveryFormSubmit.emit({
      formElm: deliveryFormElm,
      form: this.deliveryForm,
      formData,
      payload,
      fileInput,
      resetForm: () => {
        this.resetForm(deliveryFormElm, fileInput);
      }
    });
  }
}