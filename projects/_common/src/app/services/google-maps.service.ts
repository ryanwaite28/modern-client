import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PlainObject } from '../interfaces/json-object.interface';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private google?: any;
  private isReadyStream = new BehaviorSubject<any>(null);
  private componentForm: PlainObject = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  constructor(
    private clientService: ClientService
  ) {
    this.clientService.sendRequest<{ data: string }>(`/common/utils/get-google-api-key`, 'POST').subscribe({
      next: (response) => {
        this.getGoogleMaps(response.data);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.isReadyStream.error(error);
      }
    });
  }

  private getGoogleMaps(google_api_key: string) {
    const wd = (<any> window);
    wd['initMap'] = () => {
      this.google = wd['google'];
      console.log('google maps loaded.', this);
      this.isReadyStream.next(wd['google']);
    };

    const googleScript = document.createElement('script');
    googleScript.setAttribute('async', 'true');
    googleScript.setAttribute('defer', 'true');
    const srcUrl = `https://maps.googleapis.com/maps/api/js?key=${google_api_key}&libraries=places&callback=initMap`;
    googleScript.setAttribute('src', srcUrl);

    document.body.appendChild(googleScript);
  }

  isReady() {
    return this.isReadyStream.asObservable();
  }

  makeTextInputIntoLocationAutoComplete(
    locationInput: HTMLInputElement,
    mapBox?: HTMLDivElement
  ): Subject<{ manage: PlainObject; placeData: PlainObject; }> {
    const google = this.google;
    if (!google) {
      throw new ReferenceError(`makeTextInputIntoLocationAutoComplete() error: Google maps API is not loaded...`);
    }

    const manage: any = {
      map: (!!mapBox || null) && new google.maps.Map(mapBox, {
        center: {
          lat: 39.173303,
          lng: -77.177274
        },
        scrollwheel: true,
        zoom: 5
      }),
      marker: null,
      place: {},
      infowindow: new google.maps.InfoWindow(),
      input: locationInput,
      autocomplete: new google.maps.places.Autocomplete(locationInput),
    };

    if (mapBox) {
      manage.autocomplete.bindTo('bounds', manage.map);
      manage.map.controls[google.maps.ControlPosition.TOP_LEFT].push(manage.input);
      manage.marker = new google.maps.Marker({
        map: manage.map,
      });
      manage.marker.clearLocation = function() {
        manage.marker.place_id = false;
        manage.marker.location = false;
        manage.marker.latitude = false;
        manage.marker.longitude = false;
        console.log("location cleared");
      }
    }
    
    // create by-directional communicator
    const place_changes = new Subject<{ manage: PlainObject; placeData: PlainObject; }>();

    const place_changed_success_callback = () => {
      manage.infowindow.close();
      var place = manage.autocomplete.getPlace();
      Object.assign(manage.place, place);

      if (!place.geometry) {
        return;
      }

      if (mapBox && place.geometry.viewport) {
        manage.map.fitBounds(place.geometry.viewport);
        manage.map.setCenter(place.geometry.location);
        manage.map.setZoom(17);
      }

      console.log(place);
      if (mapBox) {
        manage.marker.place_id = place.place_id;
        manage.marker.location = place.formatted_address;
        manage.marker.latitude = place.geometry.location.lat();
        manage.marker.longitude = place.geometry.location.lng();

        // Set the position of the marker using the place ID and location.
        manage.marker.setPlace( /** @type {!google.maps.Place} */ ({
          placeId: place.place_id,
          location: place.geometry.location
        }));
        manage.marker.setVisible(true);

        manage.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address +
        '</div>');

        manage.infowindow.open(manage.map, manage.marker);
      }

      const formatted_address = place.formatted_address;
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      const placeData: PlainObject = {};
      
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          var val = place.address_components[i][this.componentForm[addressType]];
          placeData[this.switchName(addressType)] = val;
          var elm = document.getElementById(addressType);
          if (elm) { (<any> elm).value = val; };
        }
      }
      if (!placeData['city']) {
        placeData['city'] = '';
      }
      if (!placeData['state']) {
        placeData['state'] = '';
      }

      const { city, country, zipcode, route, state, street_number } = placeData;
      const location = `${street_number} ${route}, ${city}, ${state} ${zipcode}, ${country}`.trim();
      placeData.location = location;
      placeData.address = formatted_address;
      placeData.lat = latitude;
      placeData.lng = longitude;

      // emit data
      place_changes.next({ manage, placeData });
    };

    // Get the full place details when the user selects a place from the list of suggestions.
    google.maps.event.addListener(manage.autocomplete, 'place_changed', place_changed_success_callback);

    place_changes.subscribe({
      next: () => {},
      error: () => {},
      complete: () => {
        // caller should communicate when it is done with this subject
        console.log(`removing listener...`);
        google.maps.event.clearInstanceListeners(manage.autocomplete);
        console.log(`removed listener.`);
      }
    });

    Object.freeze(manage);

    return place_changes;
  }

  private switchName(name: string) {
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
}