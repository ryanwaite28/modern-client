import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UsersService } from 'projects/_common/src/app/services/users.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'hotspot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  you: IUser | any;
  
  appName: string = 'HotSpot';
  appPath = 'hotspot';
  appLinks: any[] = [];
  appMainPageLink: any[] = ['/', 'modern', 'apps', this.appPath];

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe((you) => {
      this.you = you;
      if (this.you) {
        this.appLinks = [
          {
            name: 'Home',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'home'],
            title: 'HotSpot User Home Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Settings',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'settings'],
            title: 'HotSpot User Settings Page',
            class: '',
            requiresAuth: true
          },
        ];
      }
    });
  }
}
