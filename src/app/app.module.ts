import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';

// Pages
import { HomePage } from '../pages/home/home';

// Components
import { MyApp } from './app.component';

// Services
import { UserServiceProvider } from '../providers/user-service/user-service';
import { RewardServiceProvider } from '../providers/reward-service/reward-service';

// 3rd Party Libraries
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Modules
import { RewardModalPageModule } from '../pages/reward-modal/reward-modal.module';
import { AccountPageModule } from '../pages/account/account.module';
import { MenuServiceProvider } from '../providers/menu-service/menu-service';

export const firebaseConfig = {
  apiKey: "AIzaSyDwV3GU50fAudLNBdFhEiLtczx3PqNR1Ek",
  authDomain: "wired-brain-e25f9.firebaseapp.com",
  databaseURL: "https://wired-brain-e25f9.firebaseio.com",
  storageBucket: "wired-brain-e25f9.appspot.com",
  messagingSenderId: "1089980205889"
}
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot(),
    RewardModalPageModule,
    AccountPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserServiceProvider,
    RewardServiceProvider,
    FCM,
    MenuServiceProvider
  ]
})
export class AppModule { }
