import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/user.interface';
import { IUnseen, UnseenService } from '../../services/unseen.service';
import { UsersService } from '../../services/users.service';
import { UserStoreService } from '../../stores/user-store.service';

@Component({
  selector: 'common-navbar-partial',
  templateUrl: './navbar-partial.component.html',
  styleUrls: ['./navbar-partial.component.scss']
})
export class CommonNavbarPartialComponent implements OnInit {
  you: IUser | any;
  unseenState: Partial<IUnseen> = {
    notifications: 0,
    conversations: 0,
    messages: 0,
  };
  sub: any;

  constructor(
    private router: Router,
    private unseenService: UnseenService,
    private userService: UsersService,
    private userStore: UserStoreService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      if (!you) {
        this.unseenService.clear();
      }
    });
    
    this.sub = this.unseenService.getStateChanges().subscribe((unseenState) => {
      this.unseenState = unseenState;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onSignout() {
    this.userService.sign_out();
    this.router.navigate(['/modern']);
  }
}
