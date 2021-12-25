import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'deliverme-delivery-browse-map',
  templateUrl: './delivery-browse-map.component.html',
  styleUrls: ['./delivery-browse-map.component.scss']
})
export class DeliverMeDeliveryBrowseMapPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapDiv', {  }) mapDiv?: ElementRef<HTMLDivElement> | any;
  googleSub?: Subscription;
  google?: any;
  map?: any;

  constructor(
    private googleMapsService: GoogleMapsService
  ) { }

  ngOnDestroy(): void {
    this.googleSub?.unsubscribe();
  }

  ngAfterViewInit() {
    this.googleSub = this.googleMapsService.isReady().subscribe({
      next: (google) => {
        if (google) {
          this.google = google;
          this.initGoogleMaps();
        }
      }
    });
  }

  initGoogleMaps() {
    this.map = new this.google.maps.Map(this.mapDiv!.nativeElement, {
      center: {
        lat: 39.173303,
        lng: -77.177274
      },
      scrollwheel: true,
      zoom: 5,
    });
  }
}
