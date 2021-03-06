import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { UsersController } from '../../providers/usuario/users-controller/users-controller';
import { RegisterContactPage } from '../register-contact/register-contact';
import { ExitApp } from '../../providers/utils/exit-app';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user = {
    nome_usuario: "",
    email_usuario: ""
  }

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private exitApp: ExitApp,
    private uniqueDeviceID: UniqueDeviceID,
    private userController: UsersController) {
      this.exitApp.doNothing();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProfilePage');
    this.userInfo()
  }

  public userInfo():void{
    this.uniqueDeviceID.get().then(udid => {
      this.userController.verifyDevice(udid).then((res: any) => {
        if (res.data.status_log == "logged") {
          this.userController.getUser(res.data.cod_usuario).then((res: any) => {
            this.user.nome_usuario = res.data.nome_usuario.split(" ")[0]
            this.user.email_usuario = res.data.email_usuario.split(" ")[0];
          })
        }
      })
    })
  }

  public toEditProfile():void{
    this.navCtrl.push(EditProfilePage);
  }

  public toContactPage():void{
    this.navCtrl.push(ContactPage);
  }
  public toBeforePage():void{
    this.navCtrl.setRoot(HomePage);
  }

}
