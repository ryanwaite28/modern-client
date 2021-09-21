import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUserField } from '../../../interfaces/user-field.interface';
import { IUser } from '../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { UserStoreService } from '../../../stores/user-store.service';

@Component({
  selector: 'common-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class CommonWelcomeComponent implements OnInit {
  you: IUser | any;

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
  }
}
