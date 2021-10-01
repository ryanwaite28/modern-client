import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';


@Component({
  selector: 'myfavors-create-favor',
  templateUrl: './create-favor.component.html',
  styleUrls: ['./create-favor.component.scss']
})
export class MyfavorsUserCreateFavorFragmentComponent implements OnInit, OnDestroy {
  you: any;
  loading: boolean = false;

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
    });
  }

  ngOnDestroy() {
  }

  onSubmitNewFavor(params: any) {
    const msg =
      `Are all input values correct? The favor cannot be edited later.`;
    const ask = window.confirm(msg);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.create_favor(params.formData).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        params.resetForm && params.resetForm();
        this.loading = false;
      },
      error: (error: any) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      },
    });
  }
}
