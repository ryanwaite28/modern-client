import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor() { }

  add_on_stripe_processing_fee(amount: number, isAmountAdjusted: boolean = false) {
    const stripePercentageFeeRate = 0.029;
    const stripeFixedFeeRate = 30; // 30 cents

    const total = isAmountAdjusted ? amount : parseInt(amount.toString() + '00');
    const fee_percentage = (total * stripePercentageFeeRate);
    let new_total = Math.round(total + (fee_percentage + stripeFixedFeeRate));
    const difference = new_total - total;
    let app_fee = (parseInt((total * 0.1).toString(), 10));
    app_fee = Math.round(difference + app_fee);
    const final_total = Math.round(new_total + app_fee);
    // new_total = new_total + app_fee;
    const data = { amount, final_total, app_fee, fee_percentage, new_total, isAmountAdjusted, total, difference };
    console.log(data);
    return data;
  }
}
