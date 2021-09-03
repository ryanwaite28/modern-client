import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { genderOptions } from '../../../_misc/vault';

@Component({
  selector: 'common-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class CommonUserSignupComponent implements OnInit {
  loading: boolean = false;
  verification_requested_successfully: boolean = false;
  sms_request_id: string | null = null;
  phone_is_verified: boolean = false;

  TEXT_FORM_LIMIT = 250;
  COMMON_TEXT_VALIDATOR = [
    Validators.required,
    Validators.maxLength(this.TEXT_FORM_LIMIT)
  ];

  phoneForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
  });
  phoneVerifyForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
  });

  genderOptions = genderOptions;
  signupForm = new FormGroup({
    firstname: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    middlename: new FormControl('', Validators.maxLength(this.TEXT_FORM_LIMIT)),
    lastname: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    username: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    displayname: new FormControl('', this.COMMON_TEXT_VALIDATOR),

    email: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    password: new FormControl('', this.COMMON_TEXT_VALIDATOR),
    confirmPassword: new FormControl('', this.COMMON_TEXT_VALIDATOR),
  });

  error = false;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {}

  async send_sms_verification() {
    try {
      this.error = false;
      this.loading = true;
      const phone = this.phoneForm.value.phone;
      const user = await this.userService.get_user_by_phone(phone)
        .toPromise()
        .then((response) => {
          return response && response.user;
        })
        .catch((error: HttpErrorResponse) => {
          // console.log(error);
          this.alertService.handleResponseErrorGeneric(error);
          this.error = true;
          this.loading = false;
          this.errorMessage = `Could not send verification code; something went wrong...`;
          return;
        });
      if (user) {
        this.error = true;
        this.loading = false;
        this.errorMessage = `User already exists with that phone number; phone numbers must be unique...`;
        this.alertService.handleResponseErrorGeneric(new HttpErrorResponse({
          error: { message: this.errorMessage }
        }));
        return;
      }
    } catch (e) {
      this.error = true;
      this.loading = false;
      this.errorMessage = `Something went wrong...`;
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
          this.error = true;
          this.errorMessage = error.error.message;
          this.loading = false;
        }
      );
  }

  verify_sms_code() {
    this.loading = true;
    this.userService.verify_sms_code({
      request_id: this.sms_request_id!,
      code: this.phoneVerifyForm.value.code
    }).subscribe(
      (response: any) => {
        this.phone_is_verified = true;
      },
      (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.error = true;
        this.errorMessage = error.error.message;
        this.loading = false;
      }
    );
  }

  onSubmit() {
    this.error = false;
    this.loading = true;
    this.userService.sign_up({
      ...this.phoneForm.value,
      ...this.signupForm.value,
    }).subscribe(
      (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.router.navigate(['/', 'modern', 'users', response.you.id]);
      },
      (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.error = true;
        this.errorMessage = error.error.message;
        this.loading = false;
      }
    );
  }
}
