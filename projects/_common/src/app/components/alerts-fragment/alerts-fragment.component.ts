import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAlert } from '../../interfaces/alert.interface';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'common-alerts-fragment',
  templateUrl: './alerts-fragment.component.html',
  styleUrls: ['./alerts-fragment.component.scss']
})
export class CommonAlertsFragmentComponent implements OnInit {
  alertsList: IAlert[] = [];

  subscription: Subscription | undefined;
  TIMEOUT_DURATION = 1000 * 5;

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.subscription = this.alertService.getObservabe().subscribe((params) => {
      this.alertsList.push(params.alertObj);
      if (params.autoClose) {
        setTimeout(() => {
          this.closeAlert();
        }, this.TIMEOUT_DURATION);
      }
    });
    // console.log(this);
  }

  closeAlert() {
    const alert = this.alertsList.shift();
  }
}
