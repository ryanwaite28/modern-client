import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'common-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class CommonFooterComponent implements OnInit {
  @Input() appName: string = '';
  @Input() bgColor: string = '#f8f8f8';
  year = (new Date()).getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
