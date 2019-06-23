import { Component } from '@angular/core';
import { AlertController, App, ModalController, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';


@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage {
    dataInfo: any
    title: any
    notiID: any

    user_info: any
    userID: any

    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public appData: AppData
    ) {
        this.appData.getUserInfo().then((data) => {
            this.user_info = data
            this.userID = data['id']
        })

    }

    view() {
        
    }

    parseInt(n) {
        return parseInt(n)
    }

}
