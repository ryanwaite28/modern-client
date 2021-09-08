import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'deliverme-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  you: IUser | null = null;
  
  appName: string = 'Deliver Me';
  appLinks: any[] = [];
  appMainPageLink: any[] = ['/', 'modern', 'apps', 'deliverme'];

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      if (this.you) {
        this.appLinks = [
          // {
          //   name: 'welcome',
          //   value: ['/', 'modern', 'apps', 'deliverme', 'welcome'],
          //   title: 'DeliverMe Welcome Page',
          //   class: '',
          //   requiresAuth: false
          // },
          {
            name: 'Create Delivery',
            value: ['/', 'modern', 'apps', 'deliverme', 'users', you!.id, 'create-delivery'],
            title: 'DeliverMe User Create Delivery Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Deliveries',
            value: ['/', 'modern', 'apps', 'deliverme', 'users', you!.id, 'deliveries'],
            title: 'DeliverMe User Deliveries Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Delivering',
            value: ['/', 'modern', 'apps', 'deliverme', 'users', you!.id, 'delivering'],
            title: 'DeliverMe User Delivering Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Settings',
            value: ['/', 'modern', 'apps', 'deliverme', 'users', you!.id, 'settings'],
            title: 'DeliverMe Settings Page',
            class: '',
            requiresAuth: true
          }
        ];
      }
    });
  }
}
