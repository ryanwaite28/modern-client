import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'common-user-page-card',
  templateUrl: './user-page-card.component.html',
  styleUrls: ['./user-page-card.component.scss']
})
export class CommonUserPageCardComponent implements OnInit {
  @Input() user: any;

  constructor() { }

  ngOnInit(): void {
  }

}
