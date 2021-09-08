import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'travellrs-travel-card',
  templateUrl: './travel-card.component.html',
  styleUrls: ['./travel-card.component.scss']
})
export class TravelCardComponent implements OnInit {
  @Input() travel: any;

  constructor() { }

  ngOnInit(): void {
  }
}
