import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { IUser } from '../../interfaces/user.interface';
import { IUnseen, UnseenService } from '../../services/unseen.service';
import { UsersService } from '../../services/users.service';
import { UserStoreService } from '../../stores/user-store.service';

@Component({
  selector: 'common-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class CommonNavbarComponent implements OnInit {
  you: IUser | any;
  searchQuery: string = '';
  unseenState: Partial<IUnseen> = {
    notifications: 0,
    conversations: 0,
    messages: 0,
  };

  @Input() appName: string = '';
  @Input() appLinks: any = [];
  @Input() appMainPageLink: any[] | any;
  @Input() bgColor: string = '#f8f8f8';

  constructor(
    private unseenService: UnseenService,
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
    // console.log(this);
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      if (!you) {
        this.unseenService.clear();
      }
    });

    this.unseenService.getStateChanges().subscribe((unseenState) => {
      this.unseenState = unseenState;
    });
  }

  searchProspect() {
    if (!this.searchQuery) {
      return;
    }
    const navExtras: NavigationExtras = {
      queryParams: { q: this.searchQuery }
    };
    this.router.navigate(['/search'], navExtras);
  }
}
