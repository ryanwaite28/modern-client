import { AfterViewInit, Component, ElementRef, Input, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertTypes } from 'projects/_common/src/app/enums/all.enums';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';

const sizes = [
  'X-SMALL',
  'SMALL',
  'MEDIUM',
  'LARGE',
  'X-LARGE',
];

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
  { field: 'payout', defaultValue: 0, validations: [Validators.required, Validators.min(10)] },
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
  @ViewChild('newDeliveryFormElm') newDeliveryFormElm: ElementRef<HTMLFormElement> | null = null;
  @ViewChild('fromLocationInput') fromLocationInput: ElementRef<HTMLInputElement> | null = null;
  @ViewChild('toLocationInput') toLocationInput: ElementRef<HTMLInputElement> | null = null;

  @Input() you: IUser | null = null;
  @Input() delivery: any;
  @Input() isEditing: boolean = false;
  @Input() loading?: boolean;

  @Output() deliveryFormSubmit = new EventEmitter<any>();

  google: any;
  googleSub: Subscription | null = null;
  map: any;
  fromAutocomplete: any;
  toAutocomplete: any;
  fromPlaceData: any = {};
  toPlaceData: any = {};
  sizes = sizes;
  componentForm: any = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  newDeliveryForm: FormGroup;

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private googleMapsService: GoogleMapsService,
  ) {
    const formGroupConfig: { [key:string]: FormControl } = {};
    for (const config of delivery_form_config) {
      formGroupConfig[config.field] = new FormControl(config.defaultValue, config.validations)
    }
    this.newDeliveryForm = new FormGroup(formGroupConfig);
  }

  ngAfterViewInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;

      if (this.isEditing && this.delivery && this.newDeliveryForm) {
        this.newDeliveryForm.setValue({
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
        if (this.componentForm[addressType]) {
          var val = place.address_components[i][this.componentForm[addressType]];
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

  get_distance() {
    /*  
      https://developers.google.com/maps/documentation/distance-matrix/overview#DistanceMatrixRequests
    */
    var M = 3958.8; // Radius of the Earth in miles
    var K = 3958.8; // Radius of the Earth in kilometers

    var rlat1 = this.fromPlaceData.lat * (Math.PI/180); // Convert degrees to radians
    var rlat2 = this.toPlaceData.lat * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (this.toPlaceData.lng - this.fromPlaceData.lng) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * M * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
  }

  resetForm(
    newDeliveryFormElm: HTMLFormElement,
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
      this.newDeliveryForm.reset(defaultFormValue);
      // for (const control in this.newDeliveryForm.controls) {
      //   this.newDeliveryForm.get(control)?.markAsPristine();
      //   this.newDeliveryForm.get(control)?.clearValidators();
      //   this.newDeliveryForm.get(control)?.updateValueAndValidity();
      // }

      this.fromPlaceData = {};
      this.toPlaceData = {};

      this.fromLocationInput!.nativeElement.value = '';
      this.toLocationInput!.nativeElement.value = '';
    }
  }

  onSubmitNewDelivery(
    newDeliveryFormElm: HTMLFormElement,
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

    const formData = new FormData(newDeliveryFormElm);
    const payload = {
      ...this.newDeliveryForm!.value,

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

      distance_miles: this.get_distance(),
      file: undefined,
    };
    formData.append(`payload`, JSON.stringify(payload));
    console.log(newDeliveryFormElm, this);

    this.deliveryFormSubmit.emit({
      formElm: newDeliveryFormElm,
      form: this.newDeliveryForm,
      formData,
      payload,
      fileInput,
      resetForm: () => {
        this.resetForm(newDeliveryFormElm, fileInput);
      }
    });
  }
}