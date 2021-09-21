import { Component, Input, OnInit } from '@angular/core';
import { USER_CARD_LAYOUTS } from '../../../enums/all.enums';
import { IUser } from '../../../interfaces/user.interface';

@Component({
  selector: 'common-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user: IUser | any;
  @Input() layout: USER_CARD_LAYOUTS | any = USER_CARD_LAYOUTS.LONG;

  USER_CARD_LAYOUTS = USER_CARD_LAYOUTS;

  constructor() { }

  ngOnInit(): void {
  }

}
