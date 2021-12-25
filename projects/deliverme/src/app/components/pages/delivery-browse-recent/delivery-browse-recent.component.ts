import { Component, OnInit } from '@angular/core';
import { IDelivery } from '../../../interfaces/deliverme.interface';
import { DeliveryService } from '../../../services/delivery.service';

@Component({
  selector: 'deliverme-delivery-browse-recent',
  templateUrl: './delivery-browse-recent.component.html',
  styleUrls: ['./delivery-browse-recent.component.scss']
})
export class DeliverMeDeliveryBrowseRecentPageComponent implements OnInit {
  deliveries: IDelivery[] = [];

  constructor(
    private deliveryService: DeliveryService
  ) { }

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore() {
    const min_id: number | undefined = this.deliveries[0] && this.deliveries[0].id;

    this.deliveryService.browseRecent(min_id).subscribe({
      next: (response) => {
        console.log({ response });
      }
    });
  }
}
