import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { UsersService } from '../../../services/users.service';
import { UserStoreService } from '../../../stores/user-store.service';

@Component({
  selector: 'common-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class CommonUserSigninComponent implements OnInit {
  loading: boolean = false;
  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  signinForm = new FormGroup({
    'email': new FormControl('', this.COMMON_TEXT_VALIDATOR),
    'password': new FormControl('', this.COMMON_TEXT_VALIDATOR),
  });
  error = false;
  errorMessage: string | any;

  phoneForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
  });
  phoneVerifyForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
  });
  phoneError = false;
  phoneErrorMessage: string | any;

  verification_requested_successfully: boolean = false;
  sms_request_id: string | any;
  phone_is_verified: boolean = false;

  constructor(
    private userService: UsersService,
    private userStore: UserStoreService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.error = false;
    this.loading = true;
    this.userService.sign_in(this.signinForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(['/', 'modern', 'users', response.data.you.id]);
        },
        (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
          this.errorMessage = error.error['message'];
          this.error = true;
          this.loading = false;
        },
      );
  }

  async send_sms_verification() {
    try {
      this.loading = true;
      this.phoneError = false;
      const phone = this.phoneForm.value.phone;
      const user = await this.userService.get_user_by_phone(phone)
        .toPromise()
        .then((response) => {
          return response && response.data;
        })
        .catch((error) => {
          // console.log(error);
          this.loading = false;
          this.phoneError = true;
          this.phoneErrorMessage = `Could not send verification code; something went wrong...`;
          return;
        });
      if (!user) {
        this.phoneError = true;
        this.loading = false;
        this.phoneErrorMessage = `No user found by provided phone number...`;
        return;
      }
    } catch (e) {
      this.loading = false;
      this.phoneError = true;
      this.phoneErrorMessage = `Something went wrong...`;
      throw e;
    }
    
    this.userService.send_sms_verification(`1` + this.phoneForm.value.phone)
      .subscribe(
        (response: any) => {
          this.verification_requested_successfully = true;
          this.sms_request_id = response.sms_request_id;
        },
        (error: HttpErrorResponse) => {
          this.alertService.handleResponseErrorGeneric(error);
          this.phoneError = true;
          this.phoneErrorMessage = error.error.message;
          this.loading = false;
        }
      );
  }

  verify_sms_code() {
    this.loading = true;
    this.userService.verify_sms_code({
      request_id: this.sms_request_id!,
      code: this.phoneVerifyForm.value.code,
    }).subscribe(
      (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.phone_is_verified = true;
        window.localStorage.setItem('rmw-modern-apps-jwt', response.data.token);
        this.userStore.setState(response.data.you);
        this.router.navigate(['/', 'modern', 'users', response.data.you.id]);
      },
      (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.phoneError = true;
        this.phoneErrorMessage = error.error.message;
        this.loading = false;
      }
    );
  }
}
