import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";

import { PipeModule } from '../pipes/pipes'

import { AppData } from '../providers/app-data';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { OrderPage } from '../pages/order/order';
import { NotiPage } from '../pages/noti/noti';
import { NotiDetailPage } from '../pages/noti-detail/noti-detail';
import { HistoryPage } from '../pages/history/history';
import { AccountPage } from '../pages/account/account';
import { RegisterPage } from '../pages/register/register';


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        ListPage,
        OrderPage,
        NotiPage,
        NotiDetailPage,
        HistoryPage,
        AccountPage,
        RegisterPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        PipeModule.forRoot(),
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        ListPage,
        OrderPage,
        NotiPage,
        NotiDetailPage,
        HistoryPage,
        AccountPage,
        RegisterPage,
    ],
    providers: [
        AppData,
        Geolocation,
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
