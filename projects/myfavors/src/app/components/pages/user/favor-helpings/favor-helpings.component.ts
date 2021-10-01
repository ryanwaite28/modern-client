import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FavorsService } from 'projects/myfavors/src/app/services/favors.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { flatMap } from 'rxjs/operators';

const searchCriterias = [
  { label: 'From City', value: 'from-city' },
  { label: 'To City', value: 'to-city' },

  { label: 'From State', value: 'from-state' },
  { label: 'To State', value: 'to-state' },

  { label: 'From City in State', value: 'from-city-state' },
  { label: 'To City in State', value: 'to-city-state' },

  // { label: 'County in State', value: 'county-state' },
];

@Component({
  selector: 'myfavors-favor-helpings',
  templateUrl: './favor-helpings.component.html',
  styleUrls: ['./favor-helpings.component.scss']
})
export class MyfavorsUserFavorHelpingsFragmentComponent implements OnInit, OnDestroy {
  you: any;

  current_favor_helpings: any[] = [];
  potential_favor_helping: any;

  past_favor_helpings: any[] = [];
  end_reached: boolean = true;
  loading: boolean = false;

  searchCriteriaCtrl = new FormControl(searchCriterias[2].value, []);
  searchCriterias = searchCriterias;

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
        this.getCurrentFavorHelpings();
        this.getPastFavorHelpings();
      }
    });
  }

  ngOnDestroy() {
  }

  removeCurrentFavor(favor: any) {
    const index = this.current_favor_helpings.findIndex((f) => f.favor_id === favor.id);
    if (index > -1) {
      this.current_favor_helpings.splice(index, 1);
    }
  }

  onCurrentFavorFulfilled(favor: any) {
    this.removeCurrentFavor(favor);
    this.past_favor_helpings.unshift(favor);
  }

  isFavorHelperLead(favor: any) {
    return this.favorsService.isFavorHelperLead(favor, this.you);
  }

  unassignFavor(favor: any) {
    const ask = window.confirm(`Are you sure you want to cancel helping this favor?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.favorsService.unassignFavor<any>(this.you!.id, favor.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alertService.handleResponseSuccessGeneric(response);
        this.removeCurrentFavor(favor);
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

  getCurrentFavorHelpings() {
    this.favorsService.getUserActiveFavorHelpingsAll(this.you!.id).subscribe({
      next: (response: any) => {
        this.current_favor_helpings = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  getPastFavorHelpings() {
    const min_id =
      this.past_favor_helpings.length &&
      this.past_favor_helpings[this.past_favor_helpings.length - 1].id;

    this.loading = true;
    this.favorsService.getUserPastFavorHelpings(this.you!.id, min_id).subscribe({
      next: (response: any) => {
        for (const favor_helping of response.data) {
          this.past_favor_helpings.push(favor_helping);
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

  markFavorAsStarted(favor: any) {
    const ask = window.confirm(`Have you started this favor?`);
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
        this.removeCurrentFavor(favor);
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
}