import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'common-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class CommonAppsComponent implements OnInit {

  apps = [
    {
      name: 'DeliverMe',
      icon: ``,
      desc: `Get your items delivered. Become your own carrier`,
      link: ['/', 'modern', 'apps', 'deliverme']
    },
    // {
    //   name: 'MyFavors',
    //   icon: ``,
    //   desc: `Lend a hand to those in need`,
    //   link: ['/', 'modern', 'apps', 'myfavors']
    // },
    // {
    //   name: 'HotSpot',
    //   icon: ``,
    //   desc: ``,
    //   link: ['/', 'modern', 'apps', 'hotspot']
    // },
    // {
    //   name: 'Travellrs',
    //   icon: ``,
    //   desc: ``,
    //   link: ['/', 'modern', 'apps', 'travellrs']
    // },
    // {
    //   name: 'Contender',
    //   icon: ``,
    //   desc: ``,
    //   link: ['/', 'modern', 'apps', 'contender']
    // },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
