import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { PageInterface } from '../interfaces/page';

import { AppData } from '../providers/app-data';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OrderPage } from '../pages/order/order';
import { NotiPage } from '../pages/noti/noti';
import { HistoryPage } from '../pages/history/history';
import { AccountPage } from '../pages/account/account';
import { RegisterPage } from '../pages/register/register';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;

    user_info: any = {};
    isLoggedIn: boolean = false;

    //pages: Array<{ title: string, component: any }>;
    pages: PageInterface[] = [
        { title: 'Trang chủ', component: HomePage },
        { title: 'Đặt xe', component: OrderPage },
        { title: 'Khuyến mãi', component: NotiPage },
    ];
    loggedInPages: PageInterface[] = [
        { title: 'Lịch sử ', component: HistoryPage },
        { title: 'Tài khoản', component: AccountPage },
        { title: 'Đăng xuất', component: HomePage, logsOut: true }
    ];
    loggedOutPages: PageInterface[] = [
        { title: 'Đăng nhập', component: LoginPage },
        { title: 'Đăng ký', component: RegisterPage },
    ];

    constructor(
        public events: Events,
        public menu: MenuController,
        public platform: Platform,

        public appData: AppData,

        public storage: Storage,
        public splashScreen: SplashScreen,

        public statusBar: StatusBar
    ) {
        this.initializeApp();

        this.appData.getUserInfoPromise().then((data) => {
            console.log(data);
            if (data != null) {
                this.isLoggedIn = true;
                this.enableMenu(true);

                console.log('this.isLoggedIn = ' + this.isLoggedIn);
                this.user_info = data;
            }
        });

        this.listenToLoginEvents();

    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', (user_info) => {
            //console.log(user_info);
            this.isLoggedIn = true;
            this.enableMenu(true);

            //console.log('this.isLoggedIn = ' + this.isLoggedIn);
            this.user_info = user_info;
        });

        this.events.subscribe('user:signup', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
        });
    }


    enableMenu(loggedIn: boolean) {
        console.log('enableMenu ~ ' + loggedIn);
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }


    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        
        if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            //this.appData.logout();
            this.storage.remove('hasLoggedIn');
            //this.storage.remove('username');
            //this.storage.remove('token');
            this.storage.remove('user_info');
            this.isLoggedIn = false;
            this.events.publish('user:logout');

            //this.nav.popToRoot();
        } else {
            
        }
    }
}
