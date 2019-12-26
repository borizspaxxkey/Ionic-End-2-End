import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit {

  order: any[] = [];
  orderTotal: number;
  customer: any;

  rewardsDisplay: boolean;
  discountUsed: boolean = false;
  rewardsList: any[] = [];
  discount: any;
  discountAmount: number = 0;
  discountTotal: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ngZone: NgZone,
    private cartService: CartServiceProvider, private userService: UserServiceProvider) {
  }

  ngOnInit(): void {
    this.cartService.getCart()
      .then(theCart => this.order = theCart)
      .then(cart => this.sumTotal(cart))
      .then(sum => this.orderTotal = sum)
      .then(cash => this.userService.returnUser())
      .then(cust => this.loadRewards(cust));
  }

  sumTotal(order) {
    return Promise.resolve(order.reduce((total: number, item: any) => total + item.price, 0));
  }

  removeOne(itemId, itemPrice) {
    if (this.discountTotal != 0) {
      let tmpTotal = this.discountTotal - itemPrice;
      if (tmpTotal <= 0) {
        this.userService.displayAlert('Unable to apply', 'You cannot apply rewards that  create a credit');
        this.removeReward();
      }
      else {
        this.cartService.removeItem(itemId, itemPrice);
        this.sumTotal(this.order)
          .then(sum => this.orderTotal = sum)
          .then(dis => this.discountTotal = dis - this.discount.amount);
      }
    }
    else {
      this.cartService.removeItem(itemId, itemPrice);
      this.sumTotal(this.order)
        .then(sum => this.orderTotal = sum);
    }
  }

  addRewards() {
    this.rewardsDisplay = (this.rewardsDisplay) ? false : true;
  }

  loadRewards(user) {
    this.userService.storageControl('get', `${user}-rewards`)
      .then(returned => {
        this.customer = user;

        if (!returned) {
          let tmpObj = {
            rewardId: 'No reward generated',
            amount: 0
          };
          this.rewardsList.push(tmpObj);
        }
        else {
          this.rewardsList = returned;
        }
      })
  }

  applyReward(reward) {
    let tmpAmount = this.orderTotal - reward.amount;

    if (tmpAmount <= 0) {
      this.userService.displayAlert('Unable to apply', 'You cannot apply rewards that create a credit');
    }
    else {
      this.discount = reward;
      this.discountAmount = reward.amount;
      this.discountTotal = this.orderTotal - reward.amount;
      this.discountUsed = true;
    }
  }

  removeReward() {
    this.discountUsed = false;
    this.discount = '';
  }
}
