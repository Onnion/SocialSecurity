import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BeforeLoginPage } from '../before-login/before-login';
import { TabsPage } from '../tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { UsersController } from '../../providers/usuario/users-controller/users-controller';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { ExitApp } from '../../providers/utils/exitApp';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private statusBar: StatusBar,
    private userController: UsersController,
    private uniqueDeviceID: UniqueDeviceID,
    private exitApp: ExitApp) {
      this.exitApp.exitApp();

  }

  ionViewDidLoad() {}

  public toNextPage(): void {
    this.uniqueDeviceID.get().then((udid: any) => {
      this.userController.verifyDevice(udid).then( (res: any) => {
        if(res.data.status_log == "logged"){
          this.navCtrl.setRoot(TabsPage)
        }else{
          this.navCtrl.setRoot(BeforeLoginPage)
        }
      }).catch( err => {
        this.navCtrl.setRoot(BeforeLoginPage)
      })
    });
  }

}
