import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage implements OnInit {
  accountUser: string;
  userInfo: any[] = [];
  rewardInfo: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider) {
  }

  ngOnInit(): void {
    this.accountUser = this.userService.user;
    this.userService.storageControl('get', this.accountUser)
      .then(userData => {
        console.log(userData);
      return this.userInfo = userData
      });

    this.userService.storageControl('get', `${this.accountUser}-rewards`)
      .then(rewardData => this.rewardInfo = rewardData);
  }

  ionViewCanEnter(): boolean{
    return this.userService.success;
  }
}
