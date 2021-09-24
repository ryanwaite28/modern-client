import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUserField } from 'projects/_common/src/app/interfaces/user-field.interface';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'hotspot-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class HotSpotUserPageComponent implements OnInit {
  you: IUser | any;
  user: IUser | any;
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
    });

    this.route.data.subscribe((data) => {
      this.user = data.user;
    });
  }
}
