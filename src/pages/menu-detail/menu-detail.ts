import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuServiceProvider } from '../../providers/menu-service/menu-service';

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
    milk: 'none',
    whip: 'none'
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menuService: MenuServiceProvider) {
  }

  ngOnInit(): void {
    let id = this.navParams.get('id');
    this.menuService.getOne(id)
      .then((ret) => {
        this.theCoffee = { ...ret }
      });
  }

  addToCart() {
    if (this.theCoffee.price == this.theCoffee.small) {
      this.theCoffee.size = 'small';
    }
    else if (this.theCoffee.price == this.theCoffee.medium) {
      this.theCoffee.size = 'medium';
    }
    else {
      this.theCoffee.size = 'large';
    }

    console.log('clicked', this.theCoffee);
  }
}
