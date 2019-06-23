import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AppData } from '../../providers/app-data';
import { HomePage } from '../home/home';


@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    regParams: any = {}
    submitted = false
    userID: any

    constructor(
        public navCtrl: NavController,
        public events: Events,
        public storage: Storage,
        //public userData: UserData
        public appData: AppData,
        public toastCtrl: ToastController,
    ) { 
        this.appData.getUserInfoPromise().then((data) => {
            if (data) {
                this.userID = data['id']
                this.navCtrl.setRoot(HomePage)
            }
        });

    }

    onRegister(form: NgForm) {
        this.submitted = true;

        if (form.valid) {
            this.appData.register(this.regParams).subscribe(response => {
                if (response.status == 'success') {
                    this.storage.set('hasLoggedIn', true)

                    this.storage.set('user_info', response.data)

                    console.log(response)

                    this.events.publish('user:login', response.data)

                    //this.navCtrl.push(TripsBuyPage, { gvID: response.data['MaGV'] });
                    //this.navCtrl.push(TripsBuyPage);
                    this.navCtrl.setRoot(HomePage)
                } else {
                    setTimeout(() => {
                        
                        const toast = this.toastCtrl.create({
                            message: response.msg,
                            duration: 3000
                        });
                        toast.present()
                    }, 100)
                }
            });
            //this.navCtrl.setRoot(TabsPage);
            //this.navCtrl.push(MonHocDetailPage, { tourId: oneData.id, tourInfo: oneData, name: oneData.title });
        }
    }

}
