import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'myfavors-favors',
  templateUrl: './favors.component.html',
  styleUrls: ['./favors.component.scss']
})
export class MyfavorsUserFavorsFragmentComponent implements AfterViewInit, OnDestroy {
  you: IUser | any;
  favors: any[] = [];
  end_reached: boolean = true;
  loading: boolean = false;

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private favorsService: FavorsService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  isFavorHelperLead(favor: any) {
    return this.favorsService.isFavorHelperLead(favor, this.you);
  }

  ngAfterViewInit(): void {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
      if (you) {
        this.getFavors();
      }
    });
  }

  ngOnDestroy() {
  }

  getFavors() {
    const min_id =
      this.favors.length &&
      this.favors[this.favors.length - 1].id;

    this.loading = true;
    this.favorsService.getUserFavors(this.you!.id, min_id).subscribe({
      next: (response: any) => {
        for (const favor of response.data) {
          this.favors.push(favor);
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

  onDeleteFavor(favor: any) {
    this.loading = true;
    this.favorsService.delete_favor(favor.id).subscribe({
      next: (response: any) => {
        const index = this.favors.indexOf(favor);
        this.favors.splice(index, 1);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  markFavorAsStarted(favor: any) {
    const ask = window.confirm(`Have you picked up this favor?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.markFavorAsStarted<any>(this.you!.id, favor.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(favor, response.data);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  markFavorAsCanceled(favor: any) {
    const ask = window.confirm(`Have you dropped off this favor?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.markFavorAsCanceled<any>(this.you!.id, favor.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(favor, response.data);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  markFavorAsUncanceled(favor: any) {
    const ask = window.confirm(`Uncancel and relist the favor?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.markFavorAsUncanceled<any>(this.you!.id, favor.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        Object.assign(favor, response.data);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  markFavorAsFulfilled(favor: any) {
    const ask = window.confirm(`Has this favor been fulfilled?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.markFavorAsFulfilled<any>(this.you!.id, favor.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        // this.removeCurrentFavor(favor);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  removeCurrentFavor(favor: any) {
    // const index = this.favors.findIndex((f) => f.id === favor.id);
    // if (index > -1) {
    //   this.favors.splice(index, 1);
    // }
  }

  onCurrentFavorFulfilled(favor: any) {
    // this.removeCurrentFavor(favor);
    // this.favors.unshift(favor);
  }
}
