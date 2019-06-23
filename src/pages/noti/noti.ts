import { Component } from '@angular/core';
import { AlertController, App, ModalController, NavController, ToastController, LoadingController, Refresher, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';
import { NotiDetailPage } from '../noti-detail/noti-detail';

@Component({
    selector: 'page-noti',
    templateUrl: 'noti.html'
})
export class NotiPage {

    userID: any
    user_info: any

    dataList: any
    shownData = 0

    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public appData: AppData,
    ) {
        console.log(Date.now())

        this.appData.getUserInfoPromise().then((data) => {
            this.user_info = data
            this.userID = data['id']
            this.updateList(null)
        })
    }

    updateList(refresher: any) {
        // Close any open sliding items when the tour updates
        // this.dataList && this.dataList.closeSlidingItems()

        this.appData.listNoti().subscribe((data: any) => {
            console.log(data)

            this.dataList = data
            this.shownData = data.total

            if (refresher) {
                // simulate a network request that would take longer
                // than just pulling from out local json file
                setTimeout(() => {
                    refresher.complete()

                    const toast = this.toastCtrl.create({
                        message: 'List have been updated.',
                        duration: 3000
                    });
                    toast.present()
                }, 1000)
            }
        });
    }

    refresh_list(refresher: Refresher) {
        this.updateList(refresher)
    }

    goToDetail(oneData: any) {
        // go to the tour detail page
        // and pass in the tour data

        this.navCtrl.push(NotiDetailPage, {
            notiID: oneData.id,
            dataInfo: oneData,
            title: '#'+oneData.id
        });
    }

}
