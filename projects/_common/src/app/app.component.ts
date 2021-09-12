import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from './interfaces/user.interface';
import { UserService } from './services/user.service';
import { UserStoreService } from './stores/user-store.service';

@Component({
  selector: 'common-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class CommonAppComponent {
  you: IUser | null = null;
  
  appName: string = 'Modern Apps';
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
          {
            name: 'Home',
            value: ['/', 'modern', 'users', you!.id, 'home'],
            title: 'Modern Apps - User Home Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Notifications',
            value: ['/', 'modern', 'users', you!.id, 'notifications'],
            title: 'Modern Apps - User Home Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Messages',
            value: ['/', 'modern', 'users', you!.id, 'messages'],
            title: 'Modern Apps - User Messages Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Settings',
            value: ['/', 'modern', 'users', you!.id, 'settings'],
            title: 'Modern Apps - User Home Page',
            class: '',
            requiresAuth: true
          },
        ];
      }
    });
  }
}