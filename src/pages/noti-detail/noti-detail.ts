import { Component } from '@angular/core';
import { AlertController, App, ModalController, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';


@Component({
    selector: 'page-noti-detail',
    templateUrl: 'noti-detail.html'
})
export class NotiDetailPage {
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
        this.title = this.navParams.data.title
        this.app.setTitle(this.title)

        this.dataInfo = this.navParams.data.dataInfo
        this.dataInfo['title'] = this.title
        this.notiID = this.navParams.data.notiID

        console.log(this.dataInfo)

        this.appData.getUserInfo().then((data) => {
            this.user_info = data
            this.userID = data['id']

            this.view()
        })

    }

    view() {
        this.appData.getNotiInfo(this.notiID).subscribe((data: any) => {
            console.log(data)

            this.dataInfo = data

        })
    }

    parseInt(n) {
        return parseInt(n)
    }

}
