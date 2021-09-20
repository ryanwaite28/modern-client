import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeliveryService } from 'projects/deliverme/src/app/services/delivery.service';
import { IUser } from 'projects/_common/src/app/interfaces/user.interface';
import { AlertService } from 'projects/_common/src/app/services/alert.service';
import { UserService } from 'projects/_common/src/app/services/user.service';
import { UserStoreService } from 'projects/_common/src/app/stores/user-store.service';

@Component({
  selector: 'deliverme-delivery-page',
  templateUrl: './delivery-page.component.html',
  styleUrls: ['./delivery-page.component.scss']
})
export class DeliverMeDeliveryPageComponent implements OnInit {
  you: IUser | null = null;
  delivery: any = null;

  constructor(
    private userStore: UserStoreService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private deliveryService: DeliveryService
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });
    
    this.route.data.subscribe((data) => {
      this.delivery = data.delivery;
      console.log(this);
    });
  }

  ngOnDestroy() {
  }

  onCurrentDeliveryCompleted() {
    
  }

  onCurrentDeliveryReturned() {
    
  }

  onDeleteDelivery(delivery: any) {
    this.deliveryService.delete_delivery(delivery.id).subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.router.navigate(['/', 'modern', 'apps', 'deliverme', 'users', this.you!.id, 'deliveries']);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
    });
  }
}
