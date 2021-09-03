import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'common-navbar-partial',
  templateUrl: './navbar-partial.component.html',
  styleUrls: ['./navbar-partial.component.scss']
})
export class CommonNavbarPartialComponent implements OnInit {
  @Input() you: IUser | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  onSignout() {
    this.userService.sign_out().subscribe((response) => {
      this.router.navigate(['/modern']);
    });
  }
}
