import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'myfavors-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class MyfavorsUserSettingsFragmentComponent implements OnInit, OnDestroy {
  you: IUser | any;
  loading = false;

  myfavorsSettingsForm = new FormGroup({
    phone: new FormControl('', [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{10,11}$/g)]),
    email: new FormControl('', []),

    cashapp_tag: new FormControl('', []),
    venmo_id: new FormControl('', []),
    paypal_me: new FormControl('', []),
    google_pay: new FormControl('', []),
  });

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private favorsService: FavorsService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
      if (you) {
        this.favorsService.getUserMyfavorsSettings(you.id).subscribe({
          next: (response: any) => {
            this.myfavorsSettingsForm.setValue({
              phone: response.data.phone,
              email: response.data.email,

              cashapp_tag: response.data.cashapp_tag,
              venmo_id: response.data.venmo_id,
              paypal_me: response.data.paypal_me,
              google_pay: response.data.google_pay,
            });
          },
          error: (error: any) => {
            
          },
          complete: () => {
            
          },
        });
      }
    });
  }

  ngOnDestroy() {
  }

  onSubmitUserMyfavorsSettingsForm() {
    this.loading = true;
    this.favorsService.updateUserMyfavorsSettings(this.you!.id, this.myfavorsSettingsForm.value).subscribe({
      next: (response: any) => {
        this.loading = true;
        this.alertService.handleResponseSuccessGeneric(response);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = true;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = true;
      },
    });
  }
}
