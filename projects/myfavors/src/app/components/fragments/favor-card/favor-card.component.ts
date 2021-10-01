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
import { MYFAVORS_EVENT_TYPES } from '../../../enums/myfavors.enum';
import { FavorsService } from '../../../services/favors.service';

@Component({
  selector: 'myfavors-favor-card',
  templateUrl: './favor-card.component.html',
  styleUrls: ['./favor-card.component.scss']
})
export class FavorCardComponent implements OnInit {
  @ViewChild('newFavorUpdateFormElm') newFavorUpdateFormElm: ElementRef<HTMLFormElement> | any;
  
  @Input() you: IUser | any;
  @Input() favor: any;

  @Output() favorDelete = new EventEmitter<any>();
  @Output() favorFulfilled = new EventEmitter<any>();
  @Output() favorUnassigned = new EventEmitter<any>();

  isEditing: boolean = false;
  loading: boolean = false;
  showDetails: boolean = false;
  favorEventsListeners: any[] = [];

  newFavorUpdateForm = new FormGroup({
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

  get isFavorOwner(): boolean {
    const match = !!this.you && !!this.favor && this.you.id === this.favor.owner_id;
    return match;
  }

  isFavorHelper: boolean = false;

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private favorsService: FavorsService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private socketEventsService: SocketEventsService,
  ) { }

  isFavorHelperLead(favor: any) {
    return this.favorsService.isFavorHelperLead(favor, this.you);
  }

  ngOnInit(): void {
    this.messages_list_end = !!this.favor && this.favor.favor_messages.length < 5;
    this.isFavorHelper = this.favorsService.isFavorHelper(this.favor, this.you);
    if (this.favor && this.favor.favor_updates) {
      for (const update of this.favor.favor_updates) {
        this.getLocationForUpdate(update);
      }
    }
    this.startEventListener();
  }

  ngOnDestroy() {
    for (const listener of this.favorEventsListeners) {
      listener.off && listener.off();
    }
    const favorRoom = `${MYFAVORS_EVENT_TYPES.TO_FAVOR}:${this.favor.id}`;
    this.socketEventsService.leaveRoom(favorRoom);
  }

  startEventListener() {
    if (this.favor) {
      const helperAssignedListener = this.socketEventsService.listenCustom(
        MYFAVORS_EVENT_TYPES.FAVOR_HELPER_ASSIGNED,
        (event: any) => {
          if (event.data.id === this.favor.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.favor = event.data;
          }
        }
      );

      const helperUnassignedListener = this.socketEventsService.listenCustom(
        MYFAVORS_EVENT_TYPES.FAVOR_HELPER_UNASSIGNED,
        (event: any) => {
          if (event.data.id === this.favor.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.favor = event.data;
          }
        }
      );

      const markedStartedListener = this.socketEventsService.listenCustom(
        MYFAVORS_EVENT_TYPES.FAVOR_STARTED,
        (event: any) => {
          if (event.data.id === this.favor.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.favor = event.data;
          }
        }
      );

      const markedCanceledListener = this.socketEventsService.listenCustom(
        MYFAVORS_EVENT_TYPES.FAVOR_CANCELED,
        (event: any) => {
          if (event.data.id === this.favor.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.favor = event.data;
          }
        }
      );

      const trackingUpdateListener = this.socketEventsService.listenCustom(
        MYFAVORS_EVENT_TYPES.FAVOR_NEW_UPDATE,
        (event: any) => {
          if (event.data.favor_id === this.favor.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            const update = event.data;
            this.favor.favor_updates?.unshift(update);
            this.getLocationForUpdate(update);
          }
        }
      );

      const favorFulfilledListener = this.socketEventsService.listenCustom(
        MYFAVORS_EVENT_TYPES.FAVOR_FULFILLED,
        (event: any) => {
          if (event.data.id === this.favor.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.favor = event.data;
            this.favorFulfilled.emit();
          }
        }
      );

      const helperPaidListener = this.socketEventsService.listenCustom(
        MYFAVORS_EVENT_TYPES.FAVOR_HELPER_PAID,
        (event: any) => {
          if (event.data.id === this.favor.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.favor = event.data;
            const helper = this.favor.favor_helpers.find((helper: any) => helper.user_id === event.helper_user.id);
            helper.paid = true;
          }
        }
      );

      this.favorEventsListeners = [
        helperAssignedListener,
        helperUnassignedListener,
        trackingUpdateListener,
        markedStartedListener,
        markedCanceledListener,
        favorFulfilledListener,
        helperPaidListener,
      ];

      if (
        !this.favor.datetime_started &&
        this.you!.id === this.favor.owner_id ||
        this.favor.favor_helpers.some((helper: any) => helper.user_id === this.you.id)
      ) {
        const favorRoom = `${MYFAVORS_EVENT_TYPES.TO_FAVOR}:${this.favor.id}`;
        this.socketEventsService.joinRoom(favorRoom);

        const favorMessageListener = this.socketEventsService.listenCustom(favorRoom,
          (event: any) => {
            console.log(event);
            this.handleToFavorEvents(event);
          }
        );

        this.favorEventsListeners.push(favorMessageListener);
      }

      // console.log(`favorEventsListeners`, this.favorEventsListeners);
    }
  }

  handleToFavorEvents(event: any) {
    switch (event.event) {
      case MYFAVORS_EVENT_TYPES.FAVOR_NEW_MESSAGE: {
        this.alertService.handleResponseSuccessGeneric({
          message: event.message
        });
        if (event.data.favor_id === this.favor.id) {
          this.favor.favor_messages.push(event.data);
        }
      }
    }
  }

  deleteFavor() {
    const ask = window.confirm(`Are you sure you want to delete this favor? This action cannot be undone.`);
    if (!ask) {
      return;
    }
    this.favorDelete.emit();
  }

  onSubmitNewFavorUpdate(
    newFavorUpdateFormElm: HTMLFormElement,
    iconInputElm: HTMLInputElement
  ) {
    this.loading = true;
    this.googleMapsService.getCurrentLocation().subscribe({
      next: (position: any) => {
        const formData = new FormData(newFavorUpdateFormElm);

        const helper_lat = position.coords.latitude;
        const helper_lng = position.coords.longitude;
        const payload = {
          ...this.newFavorUpdateForm.value,
          helper_lat,
          helper_lng,
          file: undefined,
        };

        formData.append(`payload`, JSON.stringify(payload));
        console.log(newFavorUpdateFormElm, this);

        this.favorsService.createUpdate(
          this.you!.id,
          this.favor.id,
          formData
        ).subscribe({
          next: (response: any) => {
            this.alertService.handleResponseSuccessGeneric(response);
            this.loading = false;
            const update = response.data;
            this.favor.favor_updates?.unshift(update);
            this.getLocationForUpdate(update);

            if (iconInputElm) {
              iconInputElm.value = '';
            }
            this.newFavorUpdateForm.reset({
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

  getLocationForUpdate(update: any) {
    this.googleMapsService.getLocationViaCoordinates(
      update.helper_lat,
      update.helper_lng,
    ).subscribe({
      next: (data: any) => {
        update.placeData = data.placeData;
        // console.log({ update, data });
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        
      },
    });
  }

  markFavorAsFulfilled() {
    const ask = window.confirm(`Is this favor been successfully delivered?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.markFavorAsFulfilled(
      this.you!.id,
      this.favor.id,
    ).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.favor = response.data;
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

  sendFavorMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.favorsService.sendFavorMessage({
      body: this.messageForm.value.body,
      favor_id: this.favor.id
    }).subscribe({
      next: (response: any) => {
        this.alertService.addAlert({
          type: this.alertService.AlertTypes.SUCCESS,
          message: response.message
        }, true);
        // this.favor.favor_messages.unshift(response.data);
        this.messageForm.setValue({ body: '' });
        this.loading = false;
      }
    });
  }

  payHelper(helper: any) {
    // https://stripe.com/docs/connect/collect-then-transfer-guide

    const ask = window.confirm(`Are you ready to pay this helper?`);
    if (!ask) {
      return;
    }
    
    this.loading = true;
    this.favorsService.payHelper(helper.user_id, this.favor.id).subscribe({
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response: any) => {
        this.loading = false;
        if (response.payment_client_secret) {
          helper.payment_client_secret = response.payment_client_secret;
          this.alertService.handleResponseSuccessGeneric(response);
          const stripe = (<any> window).Stripe(response.stripe_pk, {
            // stripeAccount: this.you!.stripe_account_id
          });
          const elements = stripe.elements();
          const style = {
            base: {
              color: "#32325d",
            }
          };
          const card = elements.create("card", { style: style });
          const cardId = '#card-element-helper-' + helper.id;
          card.mount(cardId);

          card.on('change', (event: any) => {
            const displayError = document.getElementById('card-errors-helper-' + helper.id);
            if (event.error) {
              displayError!.textContent = event.error.message;
            } else {
              displayError!.textContent = '';
            }
          });

          const form = document.getElementById('payment-form-helper-' + helper.id);

          form!.addEventListener('submit', (ev) => {
            this.loading = true;
            ev.preventDefault();
            stripe.confirmCardPayment(helper.payment_client_secret, {
              payment_method: {
                card: card,
                billing_details: {
                  email: this.favor.owner.email,
                  name: getUserFullName(this.favor.owner),
                  phone: this.favor.owner.phone,
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
                  helper.paid = true;
                  helper.payment_client_secret = null;
                  
                  // wait a second to check if the server processed the payment.succeeded webhook
                  // setTimeout(() => {
                  //   this.favorsService.markFavorAsFulfilled(
                  //     this.you!.id,
                  //     this.favor.id,
                  //   ).subscribe({
                  //     next: (response: any) => {
                  //       this.alertService.handleResponseSuccessGeneric(response);
                  //       this.loading = false;
                  //       this.favor = response.data;
                  //     },
                  //     error: (error: HttpErrorResponse) => {
                  //       this.loading = false;
                  //       // this.alertService.handleResponseErrorGeneric(error);
                  //     },
                  //     complete: () => {
                  //       this.loading = false;
                  //     }
                  //   });
                  // }, 1000);
                }
              }

            });
          });
        }
      }
    });
  }
}
