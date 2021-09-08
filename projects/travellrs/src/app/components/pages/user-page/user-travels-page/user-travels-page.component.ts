import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TravelsService } from 'projects/travellrs/src/app/services/travels.service';
import { IUserField } from 'projects/_common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'travellrs-user-travels-page',
  templateUrl: './user-travels-page.component.html',
  styleUrls: ['./user-travels-page.component.scss']
})
export class TravellrsUserTravelsPageComponent implements OnInit {
  @ViewChild('mapsDiv') mapsDiv: ElementRef<HTMLDivElement> | null = null;
  
  you: IUser | null = null;
  user: IUser | null = null;
  travels: any[] = [];
  end_reached: boolean = true;
  loading: boolean = false;
  google: any;
  googleSub: Subscription | null = null;
  map: any;
  infoWindow: any;
  markers: any[] = [];
  travelsMarkers: any = {};

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private travelsService: TravelsService,
    private alertService: AlertService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.googleSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
    });

    this.route.parent!.data.subscribe((data) => {
      this.user = data.user;
      if (this.user) {
        this.googleSub = this.googleMapsService.isReady().pipe(take(2)).subscribe((google) => {
          this.google = google;
          if (google) {
            this.initMap();
            this.getTravels();
          }
        });

      }
    });
  }

  initMap() {
    const google = this.google;

    this.map = new google.maps.Map(this.mapsDiv?.nativeElement, {
      center: {
        lat: 39.173303,
        lng: -77.177274
      },
      scrollwheel: true,
      zoom: 5
    });
    this.infoWindow = new google.maps.InfoWindow();
  }

  getTravels() {
    const min_id =
      this.travels.length &&
      this.travels[this.travels.length - 1].id;

    this.loading = true;
    this.travelsService.getUserTravels(this.user!.id, min_id).subscribe({
      next: (response) => {
        for (const travel of response.data) {
          this.travels.push(travel);
          this.addMarker(travel);
        }
        this.end_reached = response.data.length < 5;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  addMarker(travel: any) {
    const google = this.google;

    var content = '<div class="row"> \
      <div class="col s12"> \
        <p class="text-wrap"><strong>' + travel.location + '</strong></p> \
        <p class="caption-1"> \
          ' + travel.caption + '<br/> \
          <span class="text-grey"> \
            <em>' + this.datePipe.transform(travel.created_at, 'MMM d, y - h:mm a') + '</em> \
          </span> \
        </p> \
        <p class="caption-1"> \
          By: ' + travel.owner.username + ' \
        </p> \
      </div> \
    </div>';

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(travel.lat, travel.lng),
      caption: travel.caption,
      location: travel.location,
      id: travel.place_id,
      animation: google.maps.Animation.DROP,
      map: this.map,
    });

    // marker.addListener('click', () => {
    //   if (marker.getAnimation() !== null) {
    //     marker.setAnimation(null);
    //   }
    //   else {
    //     marker.setAnimation(google.maps.Animation.BOUNCE);
    //   }
    //   setTimeout(() => {
    //     marker.setAnimation(null)
    //   }, 1500);
    // });

    this.travelsMarkers[travel.id] = {
      marker: marker,
      content: content
    };

    google.maps.event.addListener(marker, 'click', () => {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      }
      else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
      setTimeout(() => {
        marker.setAnimation(null)
      }, 1500);

      this.infoWindow.setContent(content);
      this.map.setZoom(13);
      this.map.setCenter(marker.position);
      this.infoWindow.open(this.map, marker);
      this.map.panBy(0, -125);
    });
  }

  showMarker(travel: any) {
    var marker = this.travelsMarkers[travel.id].marker;
    var content = this.travelsMarkers[travel.id].content;

    this.infoWindow.setContent(content);
    this.map.setZoom(13);
    this.map.setCenter(marker.position);
    this.infoWindow.open(this.map, marker);
    this.map.panBy(0, -125);
  }
}
