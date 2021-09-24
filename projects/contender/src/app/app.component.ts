import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'contender-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  you: IUser | any;
  
  appName: string = 'Contender';
  appPath = 'contender';
  appLinks: any[] = [];
  appMainPageLink: any[] = ['/', 'modern', 'apps', this.appPath];

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
            value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'home'],
            title: 'Contender User Home Page',
            class: '',
            requiresAuth: true
          },
          // {
          //   name: 'Settings',
          //   value: ['/', 'modern', 'apps', this.appPath, 'users', you!.id, 'settings'],
          //   title: 'Contender Settings Page',
          //   class: '',
          //   requiresAuth: true
          // },
        ];
      }
    });
  }
}
