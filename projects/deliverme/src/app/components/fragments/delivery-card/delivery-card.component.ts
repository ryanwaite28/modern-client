import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { SocketEventsService } from 'projects/_common/src/app/services/socket-events.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { DELIVERME_EVENT_TYPES } from '../../../enums/deliverme.enum';
import { DeliveryService } from '../../../services/delivery.service';

@Component({
  selector: 'deliverme-delivery-card',
  templateUrl: './delivery-card.component.html',
  styleUrls: ['./delivery-card.component.scss']
})
export class DeliveryCardComponent implements OnInit {
  @ViewChild('newDeliveryTrackingUpdateFormElm') newDeliveryTrackingUpdateFormElm: ElementRef<HTMLFormElement> | null = null;
  
  @Input() you: IUser | null = null;
  @Input() delivery: any;

  @Output() deliveryDelete = new EventEmitter<any>();
  @Output() deliveryCompleted = new EventEmitter<any>();

  isEditing: boolean = false;
  loading: boolean = false;

  newDeliveryTrackingUpdateForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
    file: new FormControl(null)
  });

  deliveryEventsListeners: any[] = [];

  get isDeliveryOwner(): boolean {
    const match = !!this.you && !!this.delivery && this.you.id === this.delivery.owner_id;
    return match;
  }

  get isDeliveryCarrier(): boolean {
    const match = !!this.you && !!this.delivery && this.you.id === this.delivery.carrier_id;
    return match;
  }

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private deliveryService: DeliveryService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private socketEventsService: SocketEventsService,
  ) { }

  ngOnInit(): void {
    if (this.delivery && this.delivery.deliverme_delivery_tracking_updates) {
      for (const tracking_update of this.delivery.deliverme_delivery_tracking_updates) {
        this.getLocationForTrackingUpdate(tracking_update);
      }
    }
    this.startEventListener();
  }

  ngOnDestroy() {
    for (const listener of this.deliveryEventsListeners) {
      listener.off && listener.off();
    }
  }

  startEventListener() {
    if (this.delivery) {
      const carrierAssignedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_ASSIGNED,
        (event: any) => {
          console.log(event);
          this.alertService.handleResponseSuccessGeneric({
            message: event.message
          });
          if (event.data.id === this.delivery.id) {
            this.delivery.carrier_id = event.user.id;
            this.delivery.carrier = event.user;
          }
        }
      );

      const carrierUnassignedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_UNASSIGNED,
        (event: any) => {
          console.log(event);
          this.alertService.handleResponseSuccessGeneric({
            message: event.message
          });
          if (event.data.id === this.delivery.id) {
            this.delivery.carrier_id = null;
            this.delivery.carrier = null;
          }
        }
      );

      const markedPickedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_PICKED_UP,
        (event: any) => {
          console.log(event);
          this.alertService.handleResponseSuccessGeneric({
            message: event.message
          });
          if (event.data.id === this.delivery.id) {
            this.delivery = event.data;
          }
        }
      );

      const markedDroppedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_DROPPED_OFF,
        (event: any) => {
          console.log(event);
          this.alertService.handleResponseSuccessGeneric({
            message: event.message
          });
          if (event.data.id === this.delivery.id) {
            this.delivery = event.data;
          }
        }
      );

      const trackingUpdateListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.DELIVERY_NEW_TRACKING_UPDATE,
        (event: any) => {
          console.log(event);
          this.alertService.handleResponseSuccessGeneric({
            message: event.message
          });
          if (event.data.delivery_id === this.delivery.id) {
            const tracking_update = event.data;
            this.delivery.deliverme_delivery_tracking_updates?.push(tracking_update);
            this.getLocationForTrackingUpdate(tracking_update);
          }
        }
      );

      const deliveryCompletedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.DELIVERY_COMPLETED,
        (event: any) => {
          console.log(event);
          this.alertService.handleResponseSuccessGeneric({
            message: event.message
          });
          if (event.data.id === this.delivery.id) {
            this.delivery.completed = true;
            this.deliveryCompleted.emit();
          }
        }
      );

      this.deliveryEventsListeners = [
        carrierAssignedListener,
        carrierUnassignedListener,
        trackingUpdateListener,
        markedPickedListener,
        markedDroppedListener,
        deliveryCompletedListener
      ];

      console.log(`deliveryEventsListeners`, this.deliveryEventsListeners);
    }
  }

  deleteDelivery() {
    const ask = window.confirm(`Are you sure you want to delete this delivery? This action cannot be undone.`);
    if (!ask) {
      return;
    }
    this.deliveryDelete.emit();
  }

  onSubmitNewDeliveryTrackingUpdate(
    newDeliveryTrackingUpdateFormElm: HTMLFormElement,
    iconInputElm: HTMLInputElement
  ) {
    this.loading = true;
    this.googleMapsService.getCurrentLocation().subscribe({
      next: (position: any) => {
        const formData = new FormData(newDeliveryTrackingUpdateFormElm);

        const carrier_lat = position.coords.latitude;
        const carrier_lng = position.coords.longitude;
        const payload = {
          ...this.newDeliveryTrackingUpdateForm.value,
          carrier_lat,
          carrier_lng,
          file: undefined,
        };

        formData.append(`payload`, JSON.stringify(payload));
        console.log(newDeliveryTrackingUpdateFormElm, this);

        this.deliveryService.createTrackingUpdate(
          this.you!.id,
          this.delivery.id,
          formData
        ).subscribe({
          next: (response) => {
            this.alertService.handleResponseSuccessGeneric(response);
            this.loading = false;
            const tracking_update = response.data;
            this.delivery.deliverme_delivery_tracking_updates?.push(tracking_update);
            this.getLocationForTrackingUpdate(tracking_update);

            if (iconInputElm) {
              iconInputElm.value = '';
            }
            this.newDeliveryTrackingUpdateForm.reset({
              file: null,
              message: ''
            });
          },
          error: (error: any) => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  getLocationForTrackingUpdate(tracking_update: any) {
    this.googleMapsService.getLocationViaCoordinates(
      tracking_update.carrier_lat,
      tracking_update.carrier_lng,
    ).subscribe({
      next: (data: any) => {
        tracking_update.placeData = data.placeData;
        // console.log({ tracking_update, data });
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        
      },
    });
  }

  markDeliveryAsCompleted() {
    const ask = window.confirm(`Is this delivery paid and completed?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.markDeliveryAsCompleted(
      this.you!.id,
      this.delivery.id,
    ).subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.delivery.completed = true;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  payCarrier() {
    // const ask = window.confirm(`Are you ready to pay the carrier? This action cannot be undone.`);
    // if (!ask) {
    //   return;
    // }
    // this.loading = true;
    // this.deliveryService.payCarrier(
    //   this.you!.id,
    //   this.delivery.id,
    // ).subscribe({
    //   next: (response) => {
    //     this.alertService.handleResponseSuccessGeneric(response);
    //     this.loading = false;
    //     this.delivery.completed = true;
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.loading = false;
    //     this.alertService.handleResponseErrorGeneric(error);
    //   },
    //   complete: () => {
    //     this.loading = false;
    //   }
    // });
  }
}
