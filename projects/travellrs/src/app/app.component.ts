import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'travellrs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  you: IUser | null = null;
  
  appName: string = 'Travellrs';
  appLinks: any[] = [];
  appMainPageLink: any[] = ['/', 'modern', 'apps', 'travellrs'];

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
          //   value: ['/', 'modern', 'apps', 'travellrs', 'welcome'],
          //   title: 'Travellrs Welcome Page',
          //   class: '',
          //   requiresAuth: false
          // },
          {
            name: 'Home',
            value: ['/', 'modern', 'apps', 'travellrs', 'users', you!.id, 'home'],
            title: 'Travellrs User Home Page',
            class: '',
            requiresAuth: true
          },
          {
            name: 'Travels',
            value: ['/', 'modern', 'apps', 'travellrs', 'users', you!.id, 'travels'],
            title: 'Travellrs User Travels Page',
            class: '',
            requiresAuth: false
          },
          // {
          //   name: 'Settings',
          //   value: ['/', 'modern', 'apps', 'travellrs', 'users', you!.id, 'settings'],
          //   title: 'Travellrs Settings Page',
          //   class: '',
          //   requiresAuth: true
          // }
        ];
      }
    });
  }
}
