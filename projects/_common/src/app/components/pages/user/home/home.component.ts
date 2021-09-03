import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUserField } from 'projects/_common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'common-user-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class CommonUserHomeFragmentComponent implements OnInit {
  you: IUser | null = null;
  user: IUser | null = null;
  user_fields: IUserField[] = [];

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      if (this.isYou) {
        this.user = you;
      }
    });

    this.route.parent!.data.subscribe((data) => {
      this.user = data.user;
    });
  }
}
