import { Component, OnInit } from '@angular/core';
import { DeliveryService } from 'projects/deliverme/src/app/services/delivery.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'deliverme-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class DeliverMeUserHomeComponent implements OnInit {
  you: IUser | any;
  stats: any;

  constructor(
    private userStore: UserStoreService,
    private deliveryService: DeliveryService,
  ) { }

  ngOnInit(): void {
    console.log(this);
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.loadHomePage(you);
      }
    });
  }

  loadHomePage(you: IUser | null) {
    this.you = you;
    if (!you) {
      return;
    }
    
    this.deliveryService.getUserStats(you.id).subscribe({
      next: (response) => {
        console.log(response, this);
        this.stats = response.data;
      }
    });
  }
}
