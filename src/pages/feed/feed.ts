import { IonicPage, LoadingController } from 'ionic-angular';
import { OcurrenceController} from '../../providers/ocorrencias/ocurrence-controller/ocurrence-controller';
import { Component }   from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Toast }       from '@ionic-native/toast';
import { ExitApp } from '../../providers/utils/exit-app';
import { HomePage } from '../home/home';
import { NavController } from 'ionic-angular/navigation/nav-controller';


@IonicPage()
@Component({

  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers: [
    OcurrenceController,]
})


export class FeedPage {
 
  private list_ocurrence    = new Array<any>();
  private loader;
  private filter = { "codigo_tipo_ocorrencia" : "" };


  constructor(
    private ocurrenceController: OcurrenceController,
    private loadingCtrl: LoadingController,
    private position:    Geolocation,
    private exitApp:     ExitApp,
    private navCtrl: NavController,
    private toast:       Toast) {
      this.exitApp.doNothing()}

  /* Refresher */
  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  
  private ocurrenceFilter(){
    this.list_ocurrence = []
    this.presentLoading();
    let codigo = parseInt(this.filter.codigo_tipo_ocorrencia);
    this.position.getCurrentPosition().then((position) => {
      this.ocurrenceController.getOcurrencePerType(codigo).then((res) => {
        this.loadOcurrences(res, position);
      }).catch((err)=>{
        this.outLoading();
        this.toast.showLongCenter("Problema ao carregar as ocorrências, favor recarregar a página").subscribe(
          toast => {
            console.log(toast);
        });     
      })
    }).catch( err => {
      this.toast.showLongCenter("Localização indsponivel").subscribe(
        toast => {
          console.log(toast);
      });      
    });
  }

  private loadOcurrences(ocurrence, position){
    let result = [];
    let lst_ocurrences = JSON.parse(JSON.stringify(ocurrence)).data;
    lst_ocurrences.forEach(element => {

      if (this.getInBound(
            position.coords.latitude, 
            position.coords.longitude,
            element.posicao_ocorrencia.split(",")[0].split(":")[1], 
            element.posicao_ocorrencia.split(",")[1].split(":")[1].split("}")[0]
            )) {
                result.push(element);
            }          
    });
    if(result.length > 0){
      for(let i in result){
        let data = result[i].data_ocorrencia.split("-");
        result[i].data_ocorrencia = data[2] + "/" + data[1] + "/" + data[0];
      }
      this.list_ocurrence = result;
      this.outLoading();
    }else{
      this.outLoading();
      
      this.toast.showLongCenter("Sem ococrências próximas a você").subscribe(
        toast => {
          console.log(toast);
      });  
    }
  }

  private getInBound(lat1, lon1, lat2, lon2) {
    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344 
    return dist <= 5;
  }

  private presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando...",
    });
    this.loader.present();
  }

  private outLoading() {
    this.loader.dismiss();
  }

  private toHomePage(){
    this.navCtrl.setRoot(HomePage);
  }

  private ionViewDidEnter() {
    this.presentLoading();
    this.position.getCurrentPosition().then((position) => {
      this.ocurrenceController.getOcurrencesFeed().then( (ocurrence) => {
        this.loadOcurrences(ocurrence, position);
      }).catch( err => {
        this.outLoading();
        this.toast.showLongCenter("Problema ao carregar as ocorrências, favor recarregar a página").subscribe(
          toast => {
            console.log(toast);
        });      
      });;
    }).catch( err => {
      this.toast.showLongCenter("Localização indsponivel").subscribe(
        toast => {
          console.log(toast);
      });      
    });
  }

}
