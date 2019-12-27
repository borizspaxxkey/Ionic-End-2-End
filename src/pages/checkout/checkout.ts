import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from "@ionic-native/paypal";

// Services
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';

// Components
import { HomePage } from "../home/home";

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
    private payPal: PayPal,
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

  purchase() {
    if (this.discountUsed) {
      let tmpId = this.discount.rewardId;
      let tmp = this.rewardsList.map(x => x.rewardId).indexOf(tmpId);
      if (tmp > -1) {
        this.rewardsList.splice(tmp, 1);
      }
      this.userService.storageControl('set', `${this.customer}-rewards`)
        .then(results => console.log('Saved:', results));

      this.payCart(this.discountTotal);
      this.cartService.emptyCart();
      this.userService.displayAlert('Thank You', `Your Order for ${this.discountTotal} has been paid`);
      this.navCtrl.push(HomePage);
    }
    else {
      this.payCart(this.orderTotal);
      this.cartService.emptyCart();
      this.userService.displayAlert('Thank You', `Your order for ${this.orderTotal} has been paid`);
      this.navCtrl.push(HomePage);
    }
  }

  payCart(amount) {
    this.payPal.init({
      PayPalEnvironmentProduction: 'production Environment key goes here',
      PayPalEnvironmentSandbox: 'AU006ehVcGVBTZidPohVPf1pf_p2OJW5An9VTnvXdNZAvWcxnQKlI61DYjQpbnDpE4JoWPi3yzjp49tT'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({

      })).then(() => {
        let payment = new PayPalPayment(amount, 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log('Result from Paypal: ', res);
        }, (err) => {
          console.log('Error ', err)
        });
      }, (conf) => {
        console.log('Configuration Error: ', conf)
      });
    }, (init) => {
      console.log('Init Error: ', init)
    });
  }
}
