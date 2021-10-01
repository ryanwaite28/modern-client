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
    {
      name: 'MyFavors',
      icon: ``,
      desc: ``,
      link: ['/', 'modern', 'apps', 'myfavors']
    },
    {
      name: 'Contender',
      icon: ``,
      desc: ``,
      link: ['/', 'modern', 'apps', 'contender']
    },
    {
      name: 'HotSpot',
      icon: ``,
      desc: ``,
      link: ['/', 'modern', 'apps', 'hotspot']
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
