import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuServiceProvider } from '../../providers/menu-service/menu-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';

@IonicPage()
@Component({
  selector: 'page-menu-detail',
  templateUrl: 'menu-detail.html',
})
export class MenuDetailPage implements OnInit {
  theCoffee = {
    id: '',
    name: '',
    description: '',
    img: '',
    small: 0,
    medium: 0,
    large: 0,
    size: '',
    price: 0,
    milk: 'no',
    whip: 'no',
    orderId: ''
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserServiceProvider,
    private cartService: CartServiceProvider,
    private menuService: MenuServiceProvider) {
  }

  ngOnInit(): void {
    let id = this.navParams.get('id');
    this.menuService.getOne(id)
      .then((ret) => {
        this.theCoffee = { ...ret, price: ret.small }
      });
  }

  addToCart() {

    if (this.userService.success) {


      if (this.theCoffee.price == this.theCoffee.small) {
        this.theCoffee.size = 'small';
      }
      else if (this.theCoffee.price == this.theCoffee.medium) {
        this.theCoffee.size = 'medium';
      }
      else {
        this.theCoffee.size = 'large';
      }
      this.theCoffee.price = Number(this.theCoffee.price);
      this.theCoffee.orderId = `${this.theCoffee.id}-${this.theCoffee.price}`;
      this.cartService.addItem(this.theCoffee);
      this.userService.displayAlert(`${this.theCoffee.size} ${this.theCoffee.name}`, 'Added to cart');
    }
    else {
      this.userService.displayAlert('Cannot Add', 'You need to register an account first');
    }
  }
}
