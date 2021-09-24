import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { INotification } from 'projects/_common/src/app/interfaces/notification.interface';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UnseenService } from 'projects/_common/src/app/services/unseen.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'common-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class CommonUserNotificationsFragmentComponent implements OnInit {
  you: IUser | any;
  
  notifications: INotification[] = [];
  loading: boolean = false;
  end_reached = true;
  shouldUpdateLastOpened = true;
  
  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private unseenService: UnseenService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;

      if (this.shouldUpdateLastOpened) {
        this.shouldUpdateLastOpened = false;
        this.getNotifications();
        const notificationSub = this.userService.update_user_last_opened(this.you!.id)
          .pipe(take(1))
          .subscribe({
            next: (response) => {
              notificationSub.unsubscribe();
              this.unseenService.clear('notifications');
            }
          });
      }
    });
  }

  getNotifications() {
    const min_id =
      this.notifications.length &&
      this.notifications[this.notifications.length - 1].id;
    this.loading = true;
    this.userService.getUserNotifications<any>(
      this.you!.id,
      min_id,
    ).subscribe({
      next: (response) => {
        for (const notification of response.data) {
          this.notifications.push(notification);
        }
        this.end_reached = response.data.length < 5;
        this.loading = false;
      }
    });
  }
}
