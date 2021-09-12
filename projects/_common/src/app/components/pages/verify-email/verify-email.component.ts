import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class CommonVerifyEmailComponent implements OnInit {
  message: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.check_verify_code(params);
    });
  }

  check_verify_code(params: Params) {
    this.userService.verify_email(params.uuid)
      .subscribe(
        (response: any) => {
          this.message = response.message;
        },
        (error: HttpErrorResponse) => {
          this.message = error.error.message || `Could not verify code; something went wrong...`;
        }
      );
  }
}
