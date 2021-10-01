import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'myfavors-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  you: IUser | any;
  
  appName: string = 'My Favors';
  appPath = 'myfavors';
  appLinks: any[] = [];
  appMainPageLink: any[] = ['/', 'modern', 'apps', this.appPath];

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
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
            title: 'DeliverMe User Home Page',
            class: '',
            requiresAuth: false
          },
          {
            name: 'Create Favor',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'create-favor'],
            title: 'DeliverMe User Create Favor Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Favors',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'favors'],
            title: 'DeliverMe User Favors Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Favors Helping',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'favor-helpings'],
            title: 'DeliverMe User Favors Helping Page',
            class: '',
            requiresAuth: true
          },
          // {
          //   name: 'Settings',
          //   value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'settings'],
          //   title: 'DeliverMe Settings Page',
          //   class: '',
          //   requiresAuth: true
          // },
          {
            name: 'Search',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'search'],
            title: 'DeliverMe Search Favors Page',
            class: '',
            requiresAuth: true
          }
        ];
      }
    });
  }
}
