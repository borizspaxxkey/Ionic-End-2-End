import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-reward-modal',
  templateUrl: 'reward-modal.html',
})
export class RewardModalPage implements OnInit {

  displayParam: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {

  }

  ngOnInit(): void {
    this.displayParam = this.navParams.get('rewardParam');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
