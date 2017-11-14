import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  location : {
    lat : number,
    lng : number
  }
  constructor(private geolocation: Geolocation, public navCtrl: NavController) {

  }

  getGeoLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(JSON.stringify(resp.coords.latitude));
      console.log(JSON.stringify(resp.coords.longitude));
      this.location = {
        lat : resp.coords.latitude,
        lng : resp.coords.longitude
      }
    })
  }
}
