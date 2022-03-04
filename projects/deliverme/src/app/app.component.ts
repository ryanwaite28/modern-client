import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UsersService } from 'projects/_common/src/app/services/users.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'deliverme-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  you: IUser | any;
  
  appName: string = 'Deliver Me';
  appPath = 'deliverme';
  appLinks: any[] = [];
  appMainPageLink: any[] = ['/', 'modern', 'apps', this.appPath];

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
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
            name: 'Create Delivery',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'create-delivery'],
            title: 'DeliverMe User Create Delivery Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Deliveries',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'deliveries'],
            title: 'DeliverMe User Deliveries Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Delivering',
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'delivering'],
            title: 'DeliverMe User Delivering Page',
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
            title: 'DeliverMe Search Deliveries Page',
            class: '',
            requiresAuth: true
          },

          {
            name: 'Recent',
            value: ['/', 'modern', 'apps', this.appPath, 'deliveries', 'browse-recent'],
            title: 'DeliverMe Browse (Recent) Deliveries Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Map',
            value: ['/', 'modern', 'apps', this.appPath, 'deliveries', 'browse-map'],
            title: 'DeliverMe Browse (Map) Deliveries Page',
            class: '',
            requiresAuth: true
          }
        ];
      }
    });
  }
}
