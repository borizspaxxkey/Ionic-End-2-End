import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  regPage: any;
  login = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService: UserServiceProvider) {

  }

  ngOnInit(): void {
    this.regPage = 'RegisterPage';
  }

  signOn() {
    if (!this.login.email || !this.login.password) {
      this.userService.displayAlert('Error !', 'You must enter email and password');
    }
    else {
      this.userService.logOn(this.login.email, this.login.password)
      .then(returned => {
        if(this.userService.success){
          this.navCtrl.push(HomePage);
        }
        else {
          this.login.email = '',
          this.login.password = ''
        }
      });
    }
  }
}

