import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'common-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class CommonAppsComponent implements OnInit {

  apps = [
    {
      name: 'Travellrs',
      icon: ``,
      desc: ``,
      link: ['/', 'modern', 'apps', 'travellrs']
    },
    {
      name: 'DeliverMe',
      icon: ``,
      desc: ``,
      link: ['/', 'modern', 'apps', 'deliverme']
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
