import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { ClientService } from 'projects/_common/src/app/services/client.service';
import { GoogleMapsService } from 'projects/_common/src/app/services/google-maps.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'common-verify-stripe-account-fragment',
  templateUrl: './verify-stripe-account-fragment.component.html',
  styleUrls: ['./verify-stripe-account-fragment.component.scss']
})
export class CommonUserVerifyStripeAccountFragmentComponent implements OnInit {
  you: any;
  results: any;

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private alertService: AlertService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleMapsService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      this.checkStripeAccount();
    });
  }

  checkStripeAccount() {
    this.userService.verify_stripe_account(this.you.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.results = response;
        if (response.token) {
          window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
          this.userStore.setState(response.data.you);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.results = error.error;
      },
      complete: () => {
        
      },
    });
  }
}
