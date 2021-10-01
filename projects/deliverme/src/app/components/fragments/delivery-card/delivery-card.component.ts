import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMON_EVENT_TYPES } from 'projects/_common/src/app/enums/all.enums';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { SocketEventsService } from 'projects/_common/src/app/services/socket-events.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { getUserFullName } from 'projects/_common/src/app/_misc/chamber';
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
  @ViewChild('newDeliveryTrackingUpdateFormElm') newDeliveryTrackingUpdateFormElm: ElementRef<HTMLFormElement> | any;
  @ViewChild('paymentFormElm') paymentFormElm: ElementRef<HTMLFormElement> | any;
  
  @Input() you: IUser | any;
  @Input() delivery: any;

  @Output() deliveryDelete = new EventEmitter<any>();
  @Output() deliveryCompleted = new EventEmitter<any>();
  @Output() deliveryReturned = new EventEmitter<any>();

  isEditing: boolean = false;
  loading: boolean = false;
  showDetails: boolean = false;
  deliveryEventsListeners: any[] = [];
  payment_client_secret: any;

  newDeliveryTrackingUpdateForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
    file: new FormControl(null)
  });

  messageFormIsOpen = false;
  messages_list_end = false;
  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [
      Validators.required,
      // Validators.pattern(/(.*)+/),
      Validators.minLength(1),
      Validators.maxLength(this.MSG_MAX_LENGTH)
    ])
  });

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
    this.messages_list_end = !!this.delivery && this.delivery.delivery_messages.length < 5;
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
    const deliveryRoom = `${DELIVERME_EVENT_TYPES.TO_DELIVERY}:${this.delivery.id}`;
    this.socketEventsService.leaveRoom(deliveryRoom);
  }

  startEventListener() {
    if (this.delivery) {
      const carrierAssignedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_ASSIGNED,
        (event: any) => {
          if (event.data.id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.carrier_id = event.user.id;
            this.delivery.carrier = event.user;
            this.delivery.returned = false;
          }
        }
      );

      const carrierUnassignedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_UNASSIGNED,
        (event: any) => {
          if (event.data.id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data;
          }
        }
      );

      const markedPickedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_PICKED_UP,
        (event: any) => {
          if (event.data.id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data;
          }
        }
      );

      const markedDroppedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_DROPPED_OFF,
        (event: any) => {
          if (event.data.id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data;
          }
        }
      );

      const trackingUpdateListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.DELIVERY_NEW_TRACKING_UPDATE,
        (event: any) => {
          if (event.data.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            const tracking_update = event.data;
            this.delivery.deliverme_delivery_tracking_updates?.unshift(tracking_update);
            this.getLocationForTrackingUpdate(tracking_update);
          }
        }
      );

      const deliveryCompletedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.DELIVERY_COMPLETED,
        (event: any) => {
          if (event.data.id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.completed = true;
            this.deliveryCompleted.emit();
          }
        }
      );

      const deliveryReturnedListener = this.socketEventsService.listenCustom(
        DELIVERME_EVENT_TYPES.DELIVERY_RETURNED,
        (event: any) => {
          if (event.data.id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data;
            this.deliveryReturned.emit();
          }
        }
      );

      this.deliveryEventsListeners = [
        carrierAssignedListener,
        carrierUnassignedListener,
        trackingUpdateListener,
        markedPickedListener,
        markedDroppedListener,
        deliveryCompletedListener,
        deliveryReturnedListener,
      ];

      if (
        !this.delivery.completed &&
        this.you!.id === this.delivery.owner_id ||
        this.you!.id === this.delivery.carrier_id
      ) {
        const deliveryRoom = `${DELIVERME_EVENT_TYPES.TO_DELIVERY}:${this.delivery.id}`;
        this.socketEventsService.joinRoom(deliveryRoom);

        const deliveryMessageListener = this.socketEventsService.listenCustom(deliveryRoom,
          (event: any) => {
            console.log(event);
            this.handleToDeliveryEvents(event);
          }
        );

        this.deliveryEventsListeners.push(deliveryMessageListener);
      }

      // console.log(`deliveryEventsListeners`, this.deliveryEventsListeners);
    }
  }

  handleToDeliveryEvents(event: any) {
    switch (event.event) {
      case DELIVERME_EVENT_TYPES.DELIVERY_NEW_MESSAGE: {
        this.alertService.handleResponseSuccessGeneric({
          message: event.message
        });
        if (event.data.delivery_id === this.delivery.id) {
          this.delivery.delivery_messages.push(event.data);
        }
      }
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
          next: (response: any) => {
            this.alertService.handleResponseSuccessGeneric(response);
            this.loading = false;
            const tracking_update = response.data;
            this.delivery.deliverme_delivery_tracking_updates?.unshift(tracking_update);
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
    const ask = window.confirm(`Is this delivery been successfully delivered?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.markDeliveryAsCompleted(
      this.you!.id,
      this.delivery.id,
    ).subscribe({
      next: (response: any) => {
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

  sendDeliveryMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.deliveryService.sendDeliveryMessage({
      body: this.messageForm.value.body,
      delivery_id: this.delivery.id
    }).subscribe({
      next: (response: any) => {
        this.alertService.addAlert({
          type: this.alertService.AlertTypes.SUCCESS,
          message: response.message
        }, true);
        // this.delivery.delivery_messages.unshift(response.data);
        this.messageForm.setValue({ body: '' });
        this.loading = false;
      }
    });
  }

  payCarrier() {
    // https://stripe.com/docs/connect/collect-then-transfer-guide

    const ask = window.confirm(`Are you ready to pay the carrier?`);
    if (!ask) {
      return;
    }
    
    this.loading = true;
    this.deliveryService.createCheckoutSession(this.delivery.id).subscribe({
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response: any) => {
        this.loading = false;
        if (response.payment_client_secret) {
          this.payment_client_secret = response.payment_client_secret;
          this.alertService.handleResponseSuccessGeneric(response);
          const stripe = (<any> window).Stripe(response.stripe_pk, {
            // stripeAccount: this.you!.stripe_account_id
          });
          var elements = stripe.elements();
          var style = {
            base: {
              color: "#32325d",
            }
          };
          var card = elements.create("card", { style: style });
          const cardId = '#card-element-' + this.delivery.id;
          card.mount(cardId);

          card.on('change', (event: any) => {
            var displayError = document.getElementById('card-errors-' + this.delivery.id);
            if (event.error) {
              displayError!.textContent = event.error.message;
            } else {
              displayError!.textContent = '';
            }
          });

          const form = document.getElementById('payment-form-' + this.delivery.id);

          form!.addEventListener('submit', (ev) => {
            this.loading = true;
            ev.preventDefault();
            stripe.confirmCardPayment(this.payment_client_secret, {
              payment_method: {
                card: card,
                billing_details: {
                  email: this.delivery.owner.email,
                  name: getUserFullName(this.delivery.owner),
                  phone: this.delivery.owner.phone,
                }
              }
            }).then((result: any) => {
              this.loading = false;
              console.log({ result });
              if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
                this.alertService.showErrorMessage(result.error.message);
              } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                  // Show a success message to your customer
                  // There's a risk of the customer closing the window before callback
                  // execution. Set up a webhook or plugin to listen for the
                  // payment_intent.succeeded event that handles any business critical
                  // post-payment actions.
                  this.alertService.handleResponseSuccessGeneric({ message: `Payment successful!` });
                  
                  // wait a second to check if the server processed the payment.succeeded webhook
                  setTimeout(() => {
                    this.deliveryService.markDeliveryAsCompleted(
                      this.you!.id,
                      this.delivery.id,
                    ).subscribe({
                      next: (response: any) => {
                        this.alertService.handleResponseSuccessGeneric(response);
                        this.loading = false;
                        this.delivery.completed = true;
                      },
                      error: (error: HttpErrorResponse) => {
                        this.loading = false;
                        // this.alertService.handleResponseErrorGeneric(error);
                      },
                      complete: () => {
                        this.loading = false;
                      }
                    });
                  }, 1000);

                  
                }
              }
            });
          });
        }
      }
    });
  }
}
