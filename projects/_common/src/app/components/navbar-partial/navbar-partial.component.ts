import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/user.interface';
import { IUnseen, UnseenService } from '../../services/unseen.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'common-navbar-partial',
  templateUrl: './navbar-partial.component.html',
  styleUrls: ['./navbar-partial.component.scss']
})
export class CommonNavbarPartialComponent implements OnInit {
  @Input() you: IUser | any;
  unseenState: Partial<IUnseen> = {
    notifications: 0,
    conversations: 0,
    messages: 0,
  };
  sub: any;

  constructor(
    private router: Router,
    private unseenService: UnseenService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.sub = this.unseenService.getStateChanges().subscribe((unseenState) => {
      this.unseenState = unseenState;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onSignout() {
    this.userService.sign_out().subscribe(() => {
      this.router.navigate(['/modern']);
    });
  }
}
