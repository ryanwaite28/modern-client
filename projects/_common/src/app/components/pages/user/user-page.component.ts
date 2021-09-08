import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { IUserField } from '../../../interfaces/user-field.interface';
import { IUser } from '../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { UserStoreService } from '../../../stores/user-store.service';

@Component({
  selector: 'common-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class CommonUserPageComponent implements OnInit {
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
    });

    this.route.data.subscribe((data) => {
      this.user = data.user;
    });
  }
}
